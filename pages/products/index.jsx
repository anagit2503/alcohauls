import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from '@phosphor-icons/react'
import { PRODUCTS, CATEGORIES, getCategory } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'newest', label: 'Newest' },
]

const PRICES = [
  { value: 'under-30', label: 'Under $30', test: (p) => p < 30 },
  { value: '30-60', label: '$30 to $60', test: (p) => p >= 30 && p <= 60 },
  { value: 'over-60', label: 'Over $60', test: (p) => p > 60 },
]

function matches(p, q) {
  const hay = [p.name, p.maker, p.style, p.region, getCategory(p.category)?.name, ...p.notes].join(' ').toLowerCase()
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w))
}

export default function Products() {
  const router = useRouter()
  const { category, q, sort = 'popular', price } = router.query
  const [filtersOpen, setFiltersOpen] = useState(false)
  const cat = typeof category === 'string' ? getCategory(category) : null

  const setParam = (key, value) => {
    const next = { ...router.query }
    if (value) next[key] = value
    else delete next[key]
    router.push({ pathname: '/products', query: next }, undefined, { shallow: true, scroll: false })
  }

  const results = useMemo(() => {
    let list = PRODUCTS.slice()
    if (cat) list = list.filter((p) => p.category === cat.slug)
    if (typeof q === 'string' && q.trim()) list = list.filter((p) => matches(p, q))
    const band = PRICES.find((b) => b.value === price)
    if (band) list = list.filter((p) => band.test(p.price))
    const sorters = {
      popular: (a, b) => b.reviews - a.reviews,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      newest: (a, b) => Number(b.tags.includes('new')) - Number(a.tags.includes('new')) || b.id - a.id,
    }
    return list.sort(sorters[sort] || sorters.popular)
  }, [cat, q, price, sort])

  const title = q ? `Results for “${q}”` : cat ? cat.name : 'All bottles'
  const hasFilters = Boolean(cat || q || price)

  const filterPanel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-[14px] font-semibold">Category</legend>
        <ul className="mt-3 space-y-1">
          <li>
            <button type="button" onClick={() => setParam('category')} className={`w-full py-1 text-left text-[14px] ${!cat ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}>
              All categories <span className="text-muted font-normal price">({PRODUCTS.length})</span>
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <button type="button" onClick={() => setParam('category', c.slug)} className={`w-full py-1 text-left text-[14px] ${cat?.slug === c.slug ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}>
                {c.name} <span className="text-muted font-normal price">({PRODUCTS.filter((p) => p.category === c.slug).length})</span>
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
      <fieldset>
        <legend className="text-[14px] font-semibold">Price</legend>
        <ul className="mt-3 space-y-2">
          {PRICES.map((b) => (
            <li key={b.value}>
              <label className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input
                  type="checkbox"
                  checked={price === b.value}
                  onChange={() => setParam('price', price === b.value ? undefined : b.value)}
                  className="h-4 w-4 rounded-[2px] border-line accent-bottle"
                />
                {b.label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      {hasFilters && (
        <button type="button" onClick={() => router.push('/products', undefined, { shallow: true })} className="text-[14px] font-medium underline underline-offset-4">
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <>
      <Head><title>{`${title} | Alcohauls`}</title></Head>
      <div className="wrap pt-10">
        <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          {cat ? <Link href="/products" className="hover:text-ink">Shop</Link> : <span>Shop</span>}
          {cat && <><span className="mx-2">/</span><span className="text-ink">{cat.name}</span></>}
        </nav>
        <h1 className="mt-3 font-display text-[40px] leading-tight sm:text-[48px]">{title}</h1>
        {cat && !q && <p className="mt-1 text-muted">{cat.blurb}</p>}

        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">{filterPanel}</aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-4">
              <p className="text-[14px] text-muted price" aria-live="polite">
                {results.length} {results.length === 1 ? 'bottle' : 'bottles'}
              </p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setFiltersOpen(true)} className="btn-ghost h-9 border border-line px-3 lg:hidden">
                  <SlidersHorizontal size={16} /> Filters
                </button>
                <label htmlFor="sort" className="sr-only">Sort by</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value === 'popular' ? undefined : e.target.value)}
                  className="h-9 rounded-[3px] border border-line bg-white pl-3 pr-8 text-[14px] focus:border-bottle focus:outline-none"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {results.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
                {results.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="rounded-[3px] bg-stone px-6 py-16 text-center">
                <p className="font-display text-[24px]">No bottles match these filters</p>
                <p className="mt-2 text-muted">Try a broader search, or clear the filters to see everything.</p>
                <button type="button" onClick={() => router.push('/products')} className="btn-primary mt-6">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[8px] bg-paper px-6 pb-8 pt-5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-[22px]">Filters</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone" aria-label="Close filters">
                <X size={20} weight="light" />
              </button>
            </div>
            {filterPanel}
            <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary mt-8 w-full">
              Show {results.length} bottles
            </button>
          </div>
        </div>
      )}
    </>
  )
}
