// Checks whether the Square connection works: npm run check:square
// Reads .env.local, asks Square for the catalogue and prints a summary.
// Read-only: it never changes anything in Square.

import { readFileSync } from 'node:fs'

try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch {
  console.log('No .env.local file found. Copy .env.example to .env.local first.\n')
}

const token = process.env.SQUARE_ACCESS_TOKEN
if (!token) {
  console.log('SQUARE_ACCESS_TOKEN is empty, so the site is showing the DEMO products.')
  console.log('Add the token to .env.local to load the shop’s real catalogue.')
  process.exit(0)
}

const sandbox = process.env.SQUARE_ENVIRONMENT === 'sandbox'
const base = sandbox ? 'https://connect.squareupsandbox.com' : 'https://connect.squareup.com'
console.log(`Asking Square (${sandbox ? 'SANDBOX test account' : 'PRODUCTION, the real shop'})…\n`)

const res = await fetch(`${base}/v2/catalog/search`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ object_types: ['ITEM'], include_related_objects: true, limit: 1000 }),
})
const json = await res.json()

if (!res.ok) {
  console.log(`Square refused the request (${res.status}).`)
  for (const e of json.errors || []) console.log(`  ${e.code}: ${e.detail}`)
  if (res.status === 401) console.log('\nThat usually means the token is wrong, or it is a sandbox token while SQUARE_ENVIRONMENT is production.')
  process.exit(1)
}

const items = json.objects || []
const categories = new Map()
for (const o of json.related_objects || []) {
  if (o.category_data) categories.set(o.id, o.category_data.name)
}
const nameOf = (item) => [
  ...(item.item_data.categories || []).map((c) => c.id),
  item.item_data.category_id,
].map((id) => categories.get(id)).filter(Boolean)

console.log(`Connected. Square returned ${items.length} items${json.cursor ? ' (first page)' : ''}.\n`)

if (items.length === 0) {
  console.log('The account has no products yet. A sandbox account is empty until you add test items.')
  process.exit(0)
}

const counts = {}
for (const item of items) {
  for (const c of nameOf(item).length ? nameOf(item) : ['(no category)']) counts[c] = (counts[c] || 0) + 1
}
console.log('Categories in Square:')
for (const [name, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${n.toString().padStart(4)}  ${name}`)

console.log('\nFirst few products:')
for (const item of items.slice(0, 8)) {
  const price = item.item_data.variations?.[0]?.item_variation_data?.price_money?.amount
  console.log(`  ${item.item_data.name}${price != null ? ` — $${(price / 100).toFixed(2)}` : ''}`)
}
