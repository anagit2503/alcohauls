import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MagnifyingGlass, Heart, Handbag, User } from '@phosphor-icons/react'
import { CATEGORIES } from '@/lib/products'
import { SHOP } from '@/lib/shop'
import { useCartStore, useCartSummary } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import useUser from '@/hooks/useUser'
import useHydrated from '@/hooks/useHydrated'

function SearchForm({ className = '' }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  useEffect(() => {
    setQ(typeof router.query.q === 'string' ? router.query.q : '')
  }, [router.query.q])

  const submit = (e) => {
    e.preventDefault()
    router.push({ pathname: '/products', query: q.trim() ? { q: q.trim() } : {} })
  }

  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <label htmlFor="site-search" className="sr-only">Search the shop</label>
      <MagnifyingGlass size={18} weight="light" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search wine, whisky, gin…"
        className="h-11 w-full rounded-[3px] border border-line bg-white pl-10 pr-3 text-[14px] placeholder:text-muted/80 focus:border-bottle focus:outline-none focus:ring-1 focus:ring-bottle"
      />
    </form>
  )
}

function Badge({ n }) {
  if (!n) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brass px-1 text-[11px] font-semibold leading-none text-white price">
      {n}
    </span>
  )
}

export default function Header() {
  const router = useRouter()
  const hydrated = useHydrated()
  const { count } = useCartSummary()
  const wishCount = useWishlistStore((s) => s.items.length)
  const { user } = useUser()
  const openCart = useCartStore((s) => s.open)
  const activeCat = router.pathname === '/products' ? router.query.category : undefined

  const iconBtn = 'relative flex h-10 w-10 items-center justify-center rounded-full text-paper hover:bg-white/10'

  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="bg-ink text-paper">
        <div className="wrap flex h-[72px] items-center gap-4 lg:gap-10">
        <Link href="/" className="shrink-0 leading-none text-paper">
          <span className="block font-display text-[26px] tracking-[-0.01em]">{SHOP.shortName}</span>
          <span className="block text-[11px] tracking-[0.14em] text-paper/60">{SHOP.tagline}</span>
        </Link>
        <SearchForm className="hidden flex-1 md:block max-w-xl" />
        <nav aria-label="Account" className="ml-auto flex items-center gap-1">
          <Link href={hydrated && user ? '/account' : '/auth/login'} className={iconBtn} aria-label={hydrated && user ? 'Your account' : 'Sign in'}>
            <User size={22} weight="light" />
          </Link>
          <Link href="/wishlist" className={iconBtn} aria-label={`Wishlist${hydrated && wishCount ? `, ${wishCount} items` : ''}`}>
            <Heart size={22} weight="light" />
            {hydrated && <Badge n={wishCount} />}
          </Link>
          <button type="button" onClick={openCart} className={iconBtn} aria-label={`Bag${hydrated && count ? `, ${count} items` : ''}`}>
            <Handbag size={22} weight="light" />
            {hydrated && <Badge n={count} />}
          </button>
        </nav>
        </div>

        <div className="wrap pb-3 md:hidden">
          <SearchForm />
        </div>
      </div>

      <nav aria-label="Categories" className="border-y border-line">
        <ul className="wrap flex gap-x-6 overflow-x-auto whitespace-nowrap text-[14px] [scrollbar-width:none] lg:flex-wrap lg:overflow-x-visible">
          <li>
            <Link
              href="/products"
              className={`block py-3 border-b-2 -mb-px ${router.pathname === '/products' && !activeCat ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
            >
              Shop all
            </Link>
          </li>
          {CATEGORIES.filter((c) => c.slug !== 'other').map((c) => (
            <li key={c.slug}>
              <Link
                href={`/products?category=${c.slug}`}
                className={`block py-3 border-b-2 -mb-px ${activeCat === c.slug ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
