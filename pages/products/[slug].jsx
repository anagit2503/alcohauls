import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Clock, Truck, ArrowCounterClockwise } from '@phosphor-icons/react'
import { getCategory, formatPrice, isAvailable, MIN_ORDER, DELIVERY_FEE } from '@/lib/products'
import { getAllProducts, toCard, toDetail, availableFirst, usingSquare, REVALIDATE } from '@/lib/catalog'
import { useCartStore } from '@/store/cartStore'
import { ProductImage } from '@/components/Bottle'
import Rating from '@/components/Rating'
import ProductCard, { WishlistButton, productSpecs } from '@/components/ProductCard'
import { QtyStepper } from '@/components/CartDrawer'
import SectionHead from '@/components/Section'

export default function ProductPage({ product, related }) {
  const cat = getCategory(product.category)
  const addItem = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const available = isAvailable(product)
  const maxQty = product.stock == null ? 24 : Math.min(24, product.stock)
  const { description, notes, ...card } = product
  const specs = [
    ['Type', product.style],
    ['Region', product.region],
    ['Size', product.volume],
    ['Alcohol', product.abv != null ? `${product.abv}% ABV` : ''],
    ['Maker', product.maker],
  ].filter(([, v]) => v)
  const lowStock = product.stock != null && product.stock > 0 && product.stock <= 5

  return (
    <>
      <Head><title>{`${product.name} | Noma Wine &amp; Liquor`}</title></Head>
      <div className="wrap pt-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${cat.slug}`} className="hover:text-ink">{cat.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className={`mt-6 grid gap-10 lg:gap-16 ${product.image ? 'lg:grid-cols-[400px_1fr]' : 'lg:grid-cols-[1.1fr_1fr]'}`}>
          <div className={`relative flex aspect-square justify-center overflow-hidden rounded-[4px] lg:sticky lg:top-[180px] lg:self-start ${product.image ? 'items-center p-[8%]' : 'items-end pb-[6%] lg:aspect-auto lg:h-[620px]'}`} style={{ backgroundColor: product.image ? '#FFFFFF' : cat.tint }}>
            <ProductImage product={product} bottleClassName="h-[82%]" />
          </div>

          <div className="lg:pt-4">
            <p className="text-[14px] text-muted">{product.maker || product.style || cat.name}</p>
            <h1 className="mt-1 font-display text-[36px] leading-[1.08] sm:text-[44px]">{product.name}</h1>
            {product.rating != null && <Rating value={product.rating} count={product.reviews} className="mt-3 text-[14px]" />}
            <p className="mt-5 text-[26px] font-semibold price">{formatPrice(product.price, product.currency)}</p>
            {productSpecs(product) && <p className="text-[13px] text-muted">{productSpecs(product)}</p>}

            {description && <p className="mt-6 max-w-prose whitespace-pre-line text-[16px] leading-relaxed text-ink/85">{description}</p>}

            {available ? (
              <div className="mt-7 flex items-center gap-3">
                <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, Math.min(maxQty, q)))} size="lg" />
                <button type="button" onClick={() => addItem(card, qty)} className="btn-primary h-11 flex-1">
                  Add to bag, {formatPrice(product.price * qty, product.currency)}
                </button>
                <WishlistButton product={card} className="!h-11 !w-11 border border-line shadow-none" />
              </div>
            ) : (
              <div className="mt-7 flex items-center gap-3">
                <p className="btn h-11 flex-1 cursor-default bg-stone text-muted">Sold out</p>
                <WishlistButton product={card} className="!h-11 !w-11 border border-line shadow-none" />
              </div>
            )}
            {lowStock && <p className="mt-2 text-[13px] text-claret">Only {product.stock} left</p>}

            <ul className="mt-6 space-y-2.5 rounded-[3px] border border-line p-4 text-[14px]">
              <li className="flex gap-3"><Clock size={20} weight="light" className="shrink-0 text-bottle" />Order by 4pm for delivery this evening</li>
              <li className="flex gap-3"><Truck size={20} weight="light" className="shrink-0 text-bottle" />${DELIVERY_FEE} delivery · ${MIN_ORDER} minimum order</li>
              <li className="flex gap-3"><ArrowCounterClockwise size={20} weight="light" className="shrink-0 text-bottle" />Unopened bottles can be returned within 30 days</li>
            </ul>

            {notes.length > 0 && <div className="mt-9">
              <h2 className="text-[14px] font-semibold">Tasting notes</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {notes.map((n) => (
                  <li key={n} className="rounded-full bg-stone px-3.5 py-1.5 text-[14px]">{n}</li>
                ))}
              </ul>
            </div>}

            {specs.length > 0 && <div className="mt-9">
              <h2 className="text-[14px] font-semibold">Details</h2>
              <dl className="mt-2 divide-y divide-line border-y border-line text-[14px]">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[120px_1fr] py-2.5">
                    <dt className="text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>}

            {product.staffNote && (
              <blockquote className="mt-9 border-l-2 border-brass pl-5">
                <p className="font-display text-[20px] italic leading-snug">“{product.staffNote}”</p>
                <footer className="mt-2 text-[13px] text-muted">Our buyers’ note</footer>
              </blockquote>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <SectionHead title={`More ${cat.name.toLowerCase()}`} href={`/products?category=${cat.slug}`} linkText={`Shop all ${cat.name.toLowerCase()}`} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export async function getStaticPaths() {
  // Demo pages are built up front. Square pages are built on first visit, then cached.
  if (usingSquare()) return { paths: [], fallback: 'blocking' }
  const all = await getAllProducts()
  return { paths: all.map((p) => ({ params: { slug: p.slug } })), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const all = await getAllProducts()
  const product = all.find((p) => p.slug === params.slug)
  if (!product) return { notFound: true, revalidate: REVALIDATE }
  const related = availableFirst(all.filter((p) => p.category === product.category && p.id !== product.id)).slice(0, 4)
  return {
    props: { product: toDetail(product), related: related.map(toCard) },
    revalidate: REVALIDATE,
  }
}
