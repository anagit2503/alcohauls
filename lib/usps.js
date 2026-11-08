// Checks delivery addresses against USPS, using the Addresses 3.0 API at developers.usps.com.
//
//   USPS_CLIENT_ID      Consumer Key of an app on the USPS developer portal
//   USPS_CLIENT_SECRET  its Consumer Secret. Server-only.
//   USPS_ENVIRONMENT    "production" (default) or "testing" for USPS's test environment
//
// USPS confirms that a delivery point exists, down to the apartment. That catches typos and missing
// unit numbers before a driver sets off. A drop box or mailbox store can't hand a bottle to someone
// who is 21 or over, so those addresses are refused too.

const HOSTS = { production: 'https://apis.usps.com', testing: 'https://apis-tem.usps.com' }
const host = () => HOSTS[process.env.USPS_ENVIRONMENT] || HOSTS.production

export const uspsConfigured = () => Boolean(process.env.USPS_CLIENT_ID && process.env.USPS_CLIENT_SECRET)

// USPS tokens last 8 hours. One is kept per server instance and renewed a few minutes early.
let cached = null

async function accessToken() {
  if (cached && cached.expires > Date.now()) return cached.token
  const res = await fetch(`${host()}/oauth2/v3/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.USPS_CLIENT_ID,
      client_secret: process.env.USPS_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`USPS token ${res.status}: ${await res.text()}`)
  const data = await res.json()
  cached = { token: data.access_token, expires: Date.now() + (Number(data.expires_in) - 300) * 1000 }
  return cached.token
}

const clean = (v) => String(v ?? '').trim().replace(/\s+/g, ' ')

// Pulls the address fields out of whatever the browser sent.
export function readAddress(input) {
  const a = input && typeof input === 'object' ? input : {}
  return {
    street: clean(a.street).slice(0, 100),
    unit: clean(a.unit).slice(0, 40),
    city: clean(a.city).slice(0, 60),
    state: clean(a.state).toUpperCase().slice(0, 2),
    zip: clean(a.zip).slice(0, 10),
  }
}

export const formatAddress = (a) =>
  [[a.street, a.unit].filter(Boolean).join(' '), a.city, `${a.state} ${a.zip}`].filter(Boolean).join(', ')

const fail = (reason, message) => ({ ok: false, reason, message })

// Resolves to { ok: true, address } with USPS's standardised address, or { ok: false, reason,
// message } with a line the shopper can act on. Throws only when USPS itself can't be reached, so the
// caller decides what an outage means.
export async function verifyAddress(input) {
  const a = readAddress(input)
  if (!a.street || !a.city) return fail('incomplete', 'Enter your street address and city.')
  if (!/^[A-Z]{2}$/.test(a.state)) return fail('incomplete', 'Enter the two-letter state, like DC.')
  if (!/^\d{5}(-?\d{4})?$/.test(a.zip)) return fail('incomplete', 'Enter a 5-digit ZIP code.')

  const params = new URLSearchParams({ streetAddress: a.street, city: a.city, state: a.state, ZIPCode: a.zip.slice(0, 5) })
  if (a.unit) params.set('secondaryAddress', a.unit)

  const call = async () => fetch(`${host()}/addresses/v3/address?${params}`, {
    headers: { Authorization: `Bearer ${await accessToken()}`, Accept: 'application/json' },
  })
  let res = await call()
  if (res.status === 401) { cached = null; res = await call() }

  if (res.status === 400 || res.status === 404) {
    return fail('not_found', 'USPS can’t find that address. Check the street, city and ZIP code.')
  }
  if (!res.ok) throw new Error(`USPS address ${res.status}: ${await res.text()}`)

  const data = await res.json()
  const info = data.additionalInfo || {}
  const found = data.address || {}

  if (info.DPVCMRA === 'Y') {
    return fail('mailbox', 'That’s a mailbox store. We need to hand your order to someone aged 21 or over, so choose a home or office address.')
  }
  if (info.vacant === 'Y') return fail('vacant', 'USPS lists that address as vacant. Check it, or choose another.')

  switch (info.DPVConfirmation) {
    case 'Y':
      break
    case 'D':
      return fail('unit_missing', 'That building has several units. Add your apartment or suite number.')
    case 'S':
      return fail('unit_unknown', `USPS doesn’t recognise unit “${a.unit}” at that address. Check the apartment or suite number.`)
    default:
      return fail('undeliverable', 'USPS can’t deliver to that address. Check the street, city and ZIP code.')
  }

  return {
    ok: true,
    address: {
      street: found.streetAddress || a.street,
      unit: found.secondaryAddress || '',
      city: found.city || a.city,
      state: found.state || a.state,
      zip: found.ZIPPlus4 ? `${found.ZIPCode}-${found.ZIPPlus4}` : found.ZIPCode || a.zip,
    },
  }
}
