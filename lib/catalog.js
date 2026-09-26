// Where the shop's products come from. Server-only: call it from getStaticProps.
// With SQUARE_ACCESS_TOKEN set, products are loaded from Square; otherwise the demo catalogue is used.

import { PRODUCTS as DEMO_PRODUCTS, CATEGORIES, isAvailable } from './products'
import { fetchSquareProducts } from './square'

// How often pages re-fetch from Square, in seconds.
export const REVALIDATE = 300

let cache = null

// Pulling the whole Square catalogue takes ~14s, and `next dev` runs getStaticProps on every
// request. With a one-minute window, any navigation after a short pause blocked on a fresh fetch,
// which reads as a dead link. Production prerenders these pages and revalidates in the background,
// so there it only needs to be long enough to share one fetch across a build.
// (Kept in memory only: this module is imported by client code, so it can't touch `fs`.)
const MEMORY_TTL = process.env.NODE_ENV === 'production' ? 60_000 : 30 * 60_000

export const usingSquare = () => Boolean(process.env.SQUARE_ACCESS_TOKEN)

export async function getAllProducts() {
  if (!usingSquare()) return DEMO_PRODUCTS
  // During a build many pages ask at once; share one Square fetch between them.
  if (!cache || Date.now() - cache.at > MEMORY_TTL) {
    cache = { at: Date.now(), promise: fetchSquareProducts() }
    cache.promise.catch(() => { cache = null })
  }
  return cache.promise
}

// Card-sized product, used for grids, the bag and the wishlist. Page props can't contain `undefined`.
export function toCard(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    maker: p.maker || '',
    category: p.category,
    style: p.style || '',
    region: p.region || '',
    volume: p.volume || '',
    abv: p.abv ?? null,
    price: p.price,
    currency: p.currency || 'USD',
    rating: p.rating ?? null,
    reviews: p.reviews ?? null,
    tags: p.tags || [],
    image: p.image || null,
    stock: p.stock ?? null,
    bottle: p.bottle,
    staffNote: p.staffNote || null,
    updatedAt: p.updatedAt || null,
  }
}

export function toDetail(p) {
  return { ...toCard(p), description: p.description || '', notes: p.notes || [] }
}

export function categoriesWithCounts(products) {
  return CATEGORIES.map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug).length }))
    .filter((c) => c.count > 0)
}

// Sold-out bottles go to the end of any list.
export function availableFirst(list) {
  return [...list].sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)))
}
