import Link from 'next/link'
import { Truck, Clock, IdentificationCard, Snowflake } from '@phosphor-icons/react'
import { PRODUCTS, CATEGORIES, byTag, getProduct, FREE_DELIVERY_THRESHOLD } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import Bottle from '@/components/Bottle'
import SectionHead from '@/components/Section'

// Bottles on the hero shelf, left to right.
const SHELF = [17, 1, 9, 12, 24, 6]

const POPULAR = ['Champagne', 'Single malt', 'Rosé', 'Tequila', 'Pinot Noir']

const SERVICES = [
  { icon: Clock, title: 'Same-day delivery', text: 'Order by 4pm, delivered this evening.' },
  { icon: Truck, title: `Free over $${FREE_DELIVERY_THRESHOLD}`, text: 'Otherwise a flat $6.95.' },
  { icon: Snowflake, title: 'Arrives chilled', text: 'Whites and fizz come ready to pour.' },
  { icon: IdentificationCard, title: 'ID checked at the door', text: 'Recipients must be 21 or over.' },
]

// The first product in each category, shown on its tile.
const catBottle = (slug) => PRODUCTS.find((p) => p.category === slug)
const catCount = (slug) => PRODUCTS.filter((p) => p.category === slug).length

export default function Home() {
  const bestsellers = byTag('bestseller').slice(0, 8)
  const staff = byTag('staff')
  const fresh = byTag('new').slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section className="wrap pt-6 sm:pt-10">
        <div className="grid grid-cols-1 overflow-hidden rounded-[4px] lg:grid-cols-[1.1fr_1fr]">
          <div className="flex min-w-0 flex-col justify-center bg-stone px-6 py-12 sm:px-12 lg:py-16">
            <h1 className="font-display text-[44px] leading-[1.02] tracking-[-0.015em] sm:text-[58px] xl:text-[66px]">
              Good bottles, at your door tonight.
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink/80">
              Wine, spirits and beer from independent makers, chosen by our buyers and delivered the same day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary h-12 px-7">Shop all bottles</Link>
              <Link href="/products?sort=rating" className="btn-outline h-12 px-7">See top rated</Link>
            </div>
            <div className="mt-9">
              <p className="text-[13px] text-muted">Popular right now</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <li key={term}>
                    <Link
                      href={`/products?q=${encodeURIComponent(term)}`}
                      className="inline-block rounded-full border border-ink/15 bg-paper px-3.5 py-1.5 text-[13px] hover:border-ink"
                    >
                      {term}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative flex min-h-[340px] min-w-0 items-end bg-bottle px-4 pb-10 pt-16 sm:min-h-[460px] sm:px-10">
            <p className="absolute left-6 top-6 max-w-[16rem] font-display text-[17px] italic leading-snug text-paper/85 sm:left-10 sm:top-8">
              This week’s shelf, picked by our buyers
            </p>
            <div className="relative w-full">
              <ul className="relative z-10 flex items-end justify-between gap-1 sm:gap-3">
                {SHELF.map((id, i) => {
                  const p = getProduct(id)
                  return (
                    <li key={id} className="shelf-bottle min-w-0 flex-1" style={{ animationDelay: `${120 + i * 90}ms` }}>
                      <Link href={`/products/${p.slug}`} className="group block" aria-label={p.name}>
                        <Bottle product={p} title={false} className="mx-auto block h-auto max-h-[180px] w-full transition-transform duration-300 group-hover:-translate-y-2 sm:max-h-[270px]" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {/* shelf */}
              <div className="relative -mt-[6px] h-3 rounded-[1px] bg-brass shadow-[0_10px_24px_rgba(0,0,0,0.35)]" />
              <div className="h-2 bg-gradient-to-b from-black/25 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Service strip */}
      <section className="wrap mt-6">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line pb-8 pt-4 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <Icon size={26} weight="light" className="mt-0.5 shrink-0 text-bottle" />
              <div>
                <p className="text-[14px] font-semibold">{title}</p>
                <p className="text-[13px] text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="wrap mt-16">
        <SectionHead title="Shop by category" href="/products" linkText="Shop all" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((c) => {
            const p = catBottle(c.slug)
            return (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group flex h-full items-end justify-between gap-2 overflow-hidden rounded-[3px] pl-4 pt-4 sm:pl-5 sm:pt-5"
                  style={{ backgroundColor: c.tint }}
                >
                  <div className="pb-4 sm:pb-5">
                    <p className="text-[15px] font-semibold leading-tight sm:text-[16px]">{c.name}</p>
                    <p className="mt-0.5 text-[13px] text-muted">{catCount(c.slug)} bottles</p>
                  </div>
                  <Bottle product={p} title={false} className="-mb-6 h-[120px] shrink-0 transition-transform duration-300 group-hover:-translate-y-1 sm:h-[150px]" />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Bestsellers */}
      <section className="wrap mt-20">
        <SectionHead
          title="Bestsellers"
          intro="What our customers reorder most."
          href="/products?sort=popular"
          linkText="See all"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Staff picks */}
      <section className="mt-24 bg-stone py-16">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_3fr]">
          <div>
            <h2 className="font-display text-[34px] leading-tight sm:text-[40px]">What we’re drinking</h2>
            <p className="mt-3 max-w-sm text-muted">
              Our buyers taste everything before it goes on sale. These are the bottles they keep taking home.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {staff.map((p) => <ProductCard key={p.id} product={p} note={p.staffNote} />)}
          </div>
        </div>
      </section>

      {/* New */}
      <section className="wrap mt-20">
        <SectionHead title="Just in" intro="New to the shop this month." href="/products?sort=newest" linkText="See all new" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {fresh.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  )
}
