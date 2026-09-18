import Link from 'next/link'
import { CATEGORIES } from '@/lib/products'

export default function Footer() {
  return (
    <footer className="mt-24 bg-bottle-dark text-paper/80">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <p className="font-display text-[26px] text-paper">Alcohauls</p>
          <p className="mt-3 text-[14px] leading-relaxed">
            Wine, spirits and beer, chosen by people who drink them, delivered to your door.
          </p>
        </div>
        <div>
          <h2 className="text-[14px] font-semibold text-paper">Shop</h2>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}><Link href={`/products?category=${c.slug}`} className="hover:text-paper">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[14px] font-semibold text-paper">Help</h2>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li><Link href="/help#delivery" className="hover:text-paper">Delivery</Link></li>
            <li><Link href="/help#returns" className="hover:text-paper">Returns</Link></li>
            <li><Link href="/help#age" className="hover:text-paper">Age verification</Link></li>
            <li><Link href="/help" className="hover:text-paper">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-[14px] font-semibold text-paper">Your account</h2>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            <li><Link href="/account" className="hover:text-paper">Orders</Link></li>
            <li><Link href="/wishlist" className="hover:text-paper">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-paper">Bag</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="wrap flex flex-col gap-2 py-6 text-[13px] text-paper/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Alcohauls. You must be 21 or over to buy alcohol. Please drink responsibly.</p>
          <p>This is a demo shop. Products are fictional.</p>
        </div>
      </div>
    </footer>
  )
}
