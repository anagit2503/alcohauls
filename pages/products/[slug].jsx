import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Clock, Truck, ArrowCounterClockwise } from '@phosphor-icons/react'
import { PRODUCTS, getProduct, getCategory, formatPrice, FREE_DELIVERY_THRESHOLD } from '@/lib/products'
import { useCartStore } from '@/store/cartStore'
import Bottle from '@/components/Bottle'
import Rating from '@/components/Rating'
import ProductCard, { WishlistButton } from '@/components/ProductCard'
import { QtyStepper } from '@/components/CartDrawer'
import SectionHead from '@/components/Section'

export default function ProductPage({ slug }) {
  const product = getProduct(slug)
  const cat = getCategory(product.category)
  const addItem = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState(1)

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const specs = [
    ['Type', product.style],
    ['Region', product.region],
    ['Size', product.volume],
    ['Alcohol', `${product.abv}% ABV`],
    ['Maker', product.maker],
  ]

  return (
    <>
      <Head><title>{`${product.name} | Alcohauls`}</title></Head>
      <div className="wrap pt-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${cat.slug}`} className="hover:text-ink">{cat.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="relative flex aspect-square items-end justify-center rounded-[4px] pb-[6%] lg:sticky lg:top-[180px] lg:aspect-auto lg:h-[620px] lg:self-start" style={{ backgroundColor: cat.tint }}>
            <Bottle product={product} className="h-[82%]" />
          </div>

          <div className="lg:pt-4">
            <p className="text-[14px] text-muted">{product.maker}</p>
            <h1 className="mt-1 font-display text-[36px] leading-[1.08] sm:text-[44px]">{product.name}</h1>
            <Rating value={product.rating} count={product.reviews} className="mt-3 text-[14px]" />
            <p className="mt-5 text-[26px] font-semibold price">{formatPrice(product.price)}</p>
            <p className="text-[13px] text-muted">{product.volume}, {product.abv}% ABV</p>

            <p className="mt-6 max-w-prose text-[16px] leading-relaxed text-ink/85">{product.description}</p>

            <div className="mt-7 flex items-center gap-3">
              <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, Math.min(24, q)))} size="lg" />
              <button type="button" onClick={() => addItem(product.id, qty)} className="btn-primary h-11 flex-1">
                Add to bag, {formatPrice(product.price * qty)}
              </button>
              <WishlistButton id={product.id} name={product.name} className="!h-11 !w-11 border border-line shadow-none" />
            </div>

            <ul className="mt-6 space-y-2.5 rounded-[3px] border border-line p-4 text-[14px]">
              <li className="flex gap-3"><Clock size={20} weight="light" className="shrink-0 text-bottle" />Order by 4pm for delivery this evening</li>
              <li className="flex gap-3"><Truck size={20} weight="light" className="shrink-0 text-bottle" />Free delivery on orders over ${FREE_DELIVERY_THRESHOLD}</li>
              <li className="flex gap-3"><ArrowCounterClockwise size={20} weight="light" className="shrink-0 text-bottle" />Unopened bottles can be returned within 30 days</li>
            </ul>

            <div className="mt-9">
              <h2 className="text-[14px] font-semibold">Tasting notes</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.notes.map((n) => (
                  <li key={n} className="rounded-full bg-stone px-3.5 py-1.5 text-[14px]">{n}</li>
                ))}
              </ul>
            </div>

            <div className="mt-9">
              <h2 className="text-[14px] font-semibold">Details</h2>
              <dl className="mt-2 divide-y divide-line border-y border-line text-[14px]">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[120px_1fr] py-2.5">
                    <dt className="text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

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

export function getStaticPaths() {
  return { paths: PRODUCTS.map((p) => ({ params: { slug: p.slug } })), fallback: false }
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } }
}
