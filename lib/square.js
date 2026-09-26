// Loads the shop's products from Square (Catalog API + Inventory API).
// Server-only: runs in getStaticProps, never in the browser, so the access token stays secret.
//
// Environment variables:
//   SQUARE_ACCESS_TOKEN  required. Read-only token from the Square Developer Dashboard.
//   SQUARE_ENVIRONMENT   "production" (default) or "sandbox".
//   SQUARE_LOCATION_ID   optional. Only count stock at this store location.
//   SQUARE_VERSION       optional. Pins the Square API version (e.g. 2025-10-16).
//
// Choosing which products appear online (all optional, set in Vercel or .env.local):
//   SQUARE_ONLINE_CATEGORY   only show items in this Square category, e.g. "Online".
//   SQUARE_HIDDEN_CATEGORIES comma-separated categories to hide, e.g. "Cigarettes,Snacks".
//   SQUARE_HIDE_SOLD_OUT     "true" removes sold-out items instead of labelling them.
//   SQUARE_REQUIRE_IMAGE     "true" only shows items that have a photo in Square.

import { bottleFor } from './products'

const BASE = {
  production: 'https://connect.squareup.com',
  sandbox: 'https://connect.squareupsandbox.com',
}

// The shop's own Square category names, mapped onto the site's categories.
// Names are matched without case or surrounding spaces. Anything not listed falls back to
// the keyword rules below, then to the product name, then to "Other".
const CATEGORY_MAP = {
  wine: ['cabernet sauvignon', 'sauvignon blanc', 'pinot noir', 'chardonnay', 'red', 'italian red', 'french red',
    'pinot grigio', 'merlot', 'malbec', 'riesling', 'box wine', 'sweet red', 'rose', 'rosado', 'moscato',
    'pink moscato', 'zinfandel', 'french white', 'italian white', 'upper shelf wines', 'flavoured wine', 'port wine',
    'sirah', 'malbec syrah', 'cabernet shiraz', 'white merlot', 'white blend', 'orange wine', 'natural wines',
    'sweet white', 'half bottle', 'sangria', 'chablis', 'sancerre', 'albarino', 'rioja', 'garnacha', 'chenin blanc',
    'gewurztraminer', 'viognier', 'carmenere', 'vinho verde', 'georgia red', 'upper shelf wine', 'kosher',
    'portugal', 'spain', 'france', 'french', 'italian', 'italy', 'argentina', 'chile', 'austria', 'german',
    'germany', 'south africa', 'bulgarian', 'greeek', 'greek', 'nz', 'new zealand', 'organics', 'sustainable'],
  sparkling: ['champange', 'champagne', 'prosecco', 'prosecco rose', 'brut', 'brut rose', 'sparkling wine',
    'blanc de blancs', 'sweet cuvee', 'extra dry', 'cava'],
  whisky: ['bourbon', 'single malt whiskey', 'rye whiskey', 'whiskey', 'scotch', 'bourbon rye', 'upper shelf bourbon',
    'american whiskey', 'irish whiskey', 'blended scotch whiskey', 'japanese whiskey', 'indian whisky',
    'upper shelf scotch', 'american single malt', 'kentucky straight whiskey', 'honey whiskey', 'canadian', 'nips'],
  agave: ['tequila', 'mezcal', 'agave'],
  rum: ['rum', 'rhum', 'cachaca'],
  gin: ['gin'],
  vodka: ['vodka', 'flavor vodka', 'flavored vodka', 'vanilla vodka', 'premium vodka'],
  beer: ['beer', 'seltzers', 'ipa', 'domestic beer', 'imported beer', 'cider', 'craft beer', 'draft beer',
    'japanes beer', 'pilsner', 'sour ale', 'hard kombucha', 'flavored malt beverages', 'gluten free'],
  cognac: ['cognac', 'brandy', 'vsop', 'xo cognac', 'armagnac', 'calvados', 'pisco', 'grappa'],
  liqueur: ['liqueur', 'bitter', 'orange bitters', 'vermouth', 'triple sec', 'schnapps', 'coffee', 'egg nog'],
  rtd: ['cocktail', 'can cocktail', 'ready to drink ( rtd)', 'ready to drink', 'rtd', 'buzball', 'whip shots',
    'otr', 'margarita mixes', 'ready to serve pineapple'],
  sake: ['sake', 'sochu', 'soju', 'shochu', 'korean', 'chinese', 'raki', 'arak', 'feni'],
  nonalc: ['non alcoholic spirit', 'non alcoholic beer', 'alcohol removed wines', 'non alcoholic'],
  mixers: ['soda', 'mixer', 'tonic water', 'water', 'ginger beer', 'cherries', 'chili', 'gums', 'bags', 'snacks',
    'grocery', 'cheese', 'chocolate', 'raspberry', 'blueberry'],
}

const EXACT = new Map()
for (const [slug, names] of Object.entries(CATEGORY_MAP)) {
  for (const n of names) EXACT.set(n, slug)
}

// Fallback keywords, used for category names not in the table and then for product names.
// First match wins, so sparkling comes before wine and whisky before beer ("malt").
const CATEGORY_RULES = [
  ['nonalc', /non[- ]?alcoholic|alcohol removed|zero proof/i],
  ['sparkling', /champa|sparkling|prosecco|cava\b|cr[eé]mant|brut/i],
  ['sake', /\bsake\b|soju|sochu|shochu/i],
  ['cognac', /cognac|brandy|armagnac|calvados|pisco|grappa|\bvsop\b|\bxo\b/i],
  ['agave', /tequila|mezcal|agave/i],
  ['whisky', /whisk|bourbon|scotch|\brye\b|single malt/i],
  ['gin', /\bgin\b/i],
  ['rum', /\brum\b|\brhum\b|cacha[cç]a/i],
  ['vodka', /vodka/i],
  ['liqueur', /liqueur|amaro|vermouth|bitters|schnapps|triple sec|curacao/i],
  ['rtd', /cocktail|ready to drink|\brtd\b|margarita mix/i],
  ['beer', /beer|\bale\b|lager|\bipa\b|stout|porter|cider|seltzer|pilsner|\d+\s?(?:pk|pack)\b/i],
  ['mixers', /soda|tonic|mixer|juice|water/i],
  ['wine', /wine|\bred\b|\bwhite\b|ros[eé]|cabernet|merlot|pinot|chardonnay|sauvignon|malbec|riesling|zinfandel|syrah|shiraz|tempranillo|chianti|bordeaux|burgundy|moscato|sangria/i],
]

// Put items in a Square category with one of these names to feature them on the home page.
const TAG_CATEGORIES = {
  featured: 'bestseller',
  bestsellers: 'bestseller',
  'staff picks': 'staff',
  new: 'new',
  'new arrivals': 'new',
}

const list = (value) => (value || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)

const SIZE = /(\d+(?:\.\d+)?)\s?(ml|cl|l|ltr|oz)\b|\d+\s?(?:pk|pack|x\s?\d+)/i

async function square(path, body) {
  const env = process.env.SQUARE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production'
  const headers = {
    Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }
  if (process.env.SQUARE_VERSION) headers['Square-Version'] = process.env.SQUARE_VERSION

  const res = await fetch(`${BASE[env]}${path}`, { method: 'POST', headers, body: JSON.stringify(body) })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = json.errors?.map((e) => `${e.code}: ${e.detail}`).join('; ') || res.statusText
    throw new Error(`Square ${path} failed (${res.status}): ${detail}`)
  }
  return json
}

async function fetchCatalog() {
  const items = []
  const related = new Map()
  let cursor
  do {
    const page = await square('/v2/catalog/search', {
      object_types: ['ITEM'],
      include_related_objects: true,
      limit: 1000,
      cursor,
    })
    items.push(...(page.objects || []))
    for (const o of page.related_objects || []) related.set(o.id, o)
    cursor = page.cursor
  } while (cursor)
  return { items, related }
}

// Returns Map<variationId, quantity>. Variations with no count record are left out.
async function fetchStock(variationIds) {
  const stock = new Map()
  const locationIds = process.env.SQUARE_LOCATION_ID ? [process.env.SQUARE_LOCATION_ID] : undefined
  for (let i = 0; i < variationIds.length; i += 500) {
    let cursor
    do {
      const page = await square('/v2/inventory/counts/batch-retrieve', {
        catalog_object_ids: variationIds.slice(i, i + 500),
        location_ids: locationIds,
        states: ['IN_STOCK'],
        limit: 1000,
        cursor,
      })
      for (const c of page.counts || []) {
        stock.set(c.catalog_object_id, (stock.get(c.catalog_object_id) || 0) + Number(c.quantity || 0))
      }
      cursor = page.cursor
    } while (cursor)
  }
  return stock
}

function slugify(text) {
  return text.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

// Square categories decide the section; the product name is only a fallback.
function categoryFor(categoryNames, productName) {
  for (const n of categoryNames) {
    const hit = EXACT.get(n.trim().toLowerCase())
    if (hit) return hit
  }
  for (const [slug, re] of CATEGORY_RULES) {
    if (categoryNames.some((n) => re.test(n))) return slug
  }
  for (const [slug, re] of CATEGORY_RULES) {
    if (re.test(productName)) return slug
  }
  return 'other'
}

// Prices just the bottles in one basket, for checkout. Pulling the whole catalogue there costs
// ~14s on a cold start, which a shopper would spend staring at "Taking payment…". This asks Square
// for the handful of variations being bought, so it stays fast and the price is always current.
// Returns Map<variationId, { name, price, currency, stock }>; stock is null when untracked.
export async function fetchSquareItemsByIds(variationIds) {
  const found = new Map()
  if (!variationIds.length) return found

  for (let i = 0; i < variationIds.length; i += 100) {
    const batch = variationIds.slice(i, i + 100)
    const { objects = [], related_objects = [] } = await square('/v2/catalog/batch-retrieve', {
      object_ids: batch,
      include_related_objects: true,
    })
    const items = new Map(related_objects.filter((o) => o.type === 'ITEM').map((o) => [o.id, o]))

    for (const v of objects) {
      const vd = v.item_variation_data
      if (v.type !== 'ITEM_VARIATION' || !vd || v.is_deleted) continue
      if (vd.sellable === false || vd.price_money?.amount == null) continue

      const item = items.get(vd.item_id)
      const itemName = item?.item_data?.name || vd.name || ''
      const siblings = item?.item_data?.variations?.length || 1
      const name = siblings > 1 && vd.name && !itemName.includes(vd.name)
        ? `${itemName} (${vd.name})`
        : itemName

      found.set(v.id, {
        name,
        price: vd.price_money.amount / 100,
        currency: vd.price_money.currency || 'USD',
        trackStock: vd.track_inventory === true || (vd.location_overrides || []).some((o) => o.track_inventory === true),
        stock: null,
      })
    }
  }

  const tracked = [...found.entries()].filter(([, v]) => v.trackStock).map(([id]) => id)
  if (tracked.length) {
    const stock = await fetchStock(tracked)
    for (const id of tracked) found.get(id).stock = stock.get(id) || 0
  }
  for (const v of found.values()) delete v.trackStock

  return found
}

export async function fetchSquareProducts() {
  const { items, related } = await fetchCatalog()
  const onlyCategory = (process.env.SQUARE_ONLINE_CATEGORY || '').trim().toLowerCase()
  const hidden = list(process.env.SQUARE_HIDDEN_CATEGORIES)
  const products = []

  for (const item of items) {
    const data = item.item_data
    if (!data || item.is_deleted || data.is_archived) continue
    if (['GIFT_CARD', 'APPOINTMENTS_SERVICE'].includes(data.product_type)) continue

    // Newer API versions use `categories`; older ones use `category_id`.
    const categoryIds = [
      ...(data.categories || []).map((c) => c.id),
      data.reporting_category?.id,
      data.category_id,
    ].filter(Boolean)
    const categoryNames = [...new Set(categoryIds)]
      .map((id) => related.get(id)?.category_data?.name)
      .filter(Boolean)
    const tags = [...new Set(categoryNames.map((n) => TAG_CATEGORIES[n.trim().toLowerCase()]).filter(Boolean))]
    const shelfNames = categoryNames.filter((n) => !TAG_CATEGORIES[n.trim().toLowerCase()])
    const category = categoryFor(shelfNames, data.name)

    // The shop decides what appears online by how items are categorised in Square.
    const lower = categoryNames.map((n) => n.trim().toLowerCase())
    if (onlyCategory && !lower.includes(onlyCategory)) continue
    if (hidden.some((h) => lower.includes(h))) continue

    const imageId = data.image_ids?.[0]
    const image = imageId ? related.get(imageId)?.image_data?.url || null : null

    const variations = (data.variations || []).filter((v) => {
      const vd = v.item_variation_data
      return vd && !v.is_deleted && vd.sellable !== false && vd.price_money?.amount != null
    })

    for (const v of variations) {
      const vd = v.item_variation_data
      if (process.env.SQUARE_REQUIRE_IMAGE === 'true' && !image) continue
      const size = (vd.name?.match(SIZE) || data.name.match(SIZE) || [''])[0]
      const name = variations.length > 1 && vd.name && !data.name.includes(vd.name)
        ? `${data.name} (${vd.name})`
        : data.name

      products.push({
        id: v.id,
        itemId: item.id,
        slug: `${slugify(name)}-${slugify(v.id.slice(-6))}`,
        name,
        maker: '',
        category,
        style: shelfNames[0] || '',
        region: '',
        volume: size,
        abv: null,
        price: vd.price_money.amount / 100,
        currency: vd.price_money.currency || 'USD',
        rating: null,
        reviews: null,
        tags,
        notes: [],
        description: data.description_plaintext || data.description || '',
        image,
        // Square only tracks stock when track_inventory is on, overall or at a location.
        trackStock: vd.track_inventory === true || (vd.location_overrides || []).some((o) => o.track_inventory === true),
        stock: null,
        updatedAt: item.updated_at || null,
        bottle: bottleFor(category, v.id),
      })
    }
  }

  const stock = await fetchStock(products.filter((p) => p.trackStock).map((p) => p.id))
  for (const p of products) {
    // null = Square isn't tracking stock for this bottle, so treat it as available.
    p.stock = p.trackStock ? stock.get(p.id) || 0 : null
    delete p.trackStock
  }

  return process.env.SQUARE_HIDE_SOLD_OUT === 'true'
    ? products.filter((p) => p.stock == null || p.stock > 0)
    : products
}
