import Link from 'next/link'
import { InstagramLogo, Phone, MapPin } from '@phosphor-icons/react'
import { CATEGORIES } from '@/lib/products'
import { SHOP, mapsLink, mapEmbed, clock, openState } from '@/lib/shop'
import useHydrated from '@/hooks/useHydrated'

function Hours() {
  // Rendered after mount so the server and the browser agree on "today".
  const hydrated = useHydrated()
  const { index, isOpen } = hydrated ? openState() : { index: -1, isOpen: false }

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-[14px] font-semibold text-paper">Opening hours</h2>
        {hydrated && (
          <span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${isOpen ? 'bg-brass text-bottle-dark' : 'bg-paper/15 text-paper/80'}`}>
            {isOpen ? 'Open now' : 'Closed'}
          </span>
        )}
      </div>
      <dl className="mt-4 space-y-1.5 text-[14px]">
        {SHOP.hours.map((h, i) => (
          <div key={h.day} className={`flex justify-between gap-6 ${i === index ? 'text-paper' : ''}`}>
            <dt>{h.day}</dt>
            <dd className="price">{clock(h.open)} to {clock(h.close)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="mt-24 bg-bottle-dark text-paper/80">
      <div className="wrap grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-14">
        <div className="max-w-sm">
          <p className="font-display text-[26px] leading-none text-paper">{SHOP.name}</p>
          <p className="mt-3 text-[14px] leading-relaxed">
            A neighbourhood wine and liquor store in NoMa, Washington DC.
          </p>
          <address className="mt-6 space-y-3 not-italic text-[14px]">
            <a href={mapsLink} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-paper">
              <MapPin size={20} weight="light" className="mt-0.5 shrink-0 text-brass" />
              <span>{SHOP.street}<br />{SHOP.city}</span>
            </a>
            <a href={SHOP.phoneHref} className="flex items-center gap-3 hover:text-paper">
              <Phone size={20} weight="light" className="shrink-0 text-brass" />
              <span className="price">{SHOP.phone}</span>
            </a>
            <a href={SHOP.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-paper">
              <InstagramLogo size={20} weight="light" className="shrink-0 text-brass" />
              <span>Follow us on Instagram</span>
            </a>
          </address>

          <div className="mt-6 overflow-hidden rounded-[3px] border border-paper/15">
            <iframe
              title={`Map showing ${SHOP.name}`}
              src={mapEmbed}
              loading="lazy"
              className="block h-[200px] w-full"
            />
          </div>
          <a href={mapsLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[13px] underline underline-offset-4 hover:text-paper">
            Get directions
          </a>
        </div>

        <Hours />

        <div className="grid grid-cols-2 gap-10 sm:gap-6">
          <div>
            <h2 className="text-[14px] font-semibold text-paper">Shop</h2>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {CATEGORIES.filter((c) => c.nav).slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={`/products?category=${c.slug}`} className="hover:text-paper">{c.name}</Link></li>
              ))}
              <li><Link href="/products" className="hover:text-paper">Shop all</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-paper">Help</h2>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li><Link href="/help#delivery" className="hover:text-paper">Delivery</Link></li>
              <li><Link href="/help#returns" className="hover:text-paper">Returns</Link></li>
              <li><Link href="/help#age" className="hover:text-paper">Age verification</Link></li>
              <li><Link href="/account" className="hover:text-paper">Your orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-paper">Wishlist</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="wrap flex flex-col gap-2 py-6 text-[13px] text-paper/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SHOP.name}. You must be 21 or over to buy alcohol. Please drink responsibly.</p>
          <p className="price">{SHOP.phone}</p>
        </div>
      </div>
    </footer>
  )
}
