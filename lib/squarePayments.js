// Takes card payments through Square. Server-only: called from pages/api/checkout.js, never
// imported by a page, so the payment token stays out of the browser bundle.
//
// Payments deliberately use their own credentials, separate from the ones that read the catalogue:
//
//   SQUARE_PAYMENTS_ACCESS_TOKEN   required to take payments. Sandbox token while testing.
//   SQUARE_PAYMENTS_LOCATION_ID    required. The location the money is taken at.
//   SQUARE_PAYMENTS_ENVIRONMENT    "sandbox" (default) or "production".
//   NEXT_PUBLIC_SQUARE_APP_ID      the browser needs this to render the card form.
//
// Why separate: the shop's products are read from the *live* Square account, but during
// development payments must land in the *sandbox* account, or every test checkout is a real
// charge. Keeping the two sets of credentials apart lets the catalogue stay live while the money
// goes somewhere harmless. Going live means pointing these three at production values.

const BASE = {
  production: 'https://connect.squareup.com',
  sandbox: 'https://connect.squareupsandbox.com',
}

export const paymentsEnvironment = () =>
  process.env.SQUARE_PAYMENTS_ENVIRONMENT === 'production' ? 'production' : 'sandbox'

// True once the shop can actually take money. Checkout shows a clear message when it can't,
// rather than pretending to charge a card.
export const paymentsConfigured = () =>
  Boolean(process.env.SQUARE_PAYMENTS_ACCESS_TOKEN && process.env.SQUARE_PAYMENTS_LOCATION_ID)

async function square(path, body) {
  const res = await fetch(`${BASE[paymentsEnvironment()]}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_PAYMENTS_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': process.env.SQUARE_VERSION || '2025-01-23',
    },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = json.errors?.[0]
    const e = new Error(err?.detail || res.statusText)
    e.squareCode = err?.code
    e.status = res.status
    throw e
  }
  return json
}

// Square works in the currency's smallest unit, so dollars are sent as whole cents.
const cents = (amount) => Math.round(amount * 100)

// The order is built from plain line items rather than catalogue ids on purpose: the catalogue
// lives in the production account, so its ids mean nothing to the sandbox one. Names and prices
// travel fine either way, and the receipt still reads correctly.
export async function createOrderAndPayment({ sourceId, idempotencyKey, lines, delivery, total, buyer, note }) {
  const locationId = process.env.SQUARE_PAYMENTS_LOCATION_ID

  const lineItems = lines.map((l) => ({
    name: l.name.slice(0, 500),
    quantity: String(l.qty),
    base_price_money: { amount: cents(l.price), currency: 'USD' },
  }))

  if (delivery > 0) {
    lineItems.push({
      name: 'Delivery',
      quantity: '1',
      base_price_money: { amount: cents(delivery), currency: 'USD' },
    })
  }

  const { order } = await square('/v2/orders', {
    idempotency_key: `${idempotencyKey}-order`,
    order: {
      location_id: locationId,
      line_items: lineItems,
      note: note?.slice(0, 500),
    },
  })

  // Amount is taken from the order Square just priced, not from anything the browser sent.
  const due = order.total_money?.amount ?? cents(total)

  const { payment } = await square('/v2/payments', {
    idempotency_key: idempotencyKey,
    source_id: sourceId,
    amount_money: { amount: due, currency: 'USD' },
    location_id: locationId,
    order_id: order.id,
    buyer_email_address: buyer?.email,
    note: note?.slice(0, 500),
  })

  return { order, payment }
}
