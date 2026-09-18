import Link from 'next/link'
import { Heart } from '@phosphor-icons/react'
import { getCategory, formatPrice } from '@/lib/products'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import useHydrated from '@/hooks/useHydrated'
import Bottle from './Bottle'
import Rating from './Rating'

export function WishlistButton({ id, name, className = '' }) {
  const hydrated = useHydrated()
  const saved = useWishlistStore((s) => s.ids.includes(id))
  const toggle = useWishlistStore((s) => s.toggle)
  const on = hydrated && saved
  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_1px_2px_rgba(21,32,27,0.12)] hover:bg-white ${className}`}
    >
      <Heart size={18} weight={on ? 'fill' : 'light'} className={on ? 'text-claret' : ''} />
    </button>
  )
}

export default function ProductCard({ product, note }) {
  const addItem = useCartStore((s) => s.addItem)
  const cat = getCategory(product.category)
  const href = `/products/${product.slug}`

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link
          href={href}
          className="flex aspect-[4/5] items-end justify-center overflow-hidden rounded-[3px] pb-[6%]"
          style={{ backgroundColor: cat?.tint }}
          aria-label={product.name}
        >
          <Bottle product={product} title={false} className="h-[82%] transition-transform duration-500 ease-out group-hover:-translate-y-1.5" />
        </Link>
        {product.tags.includes('new') && (
          <span className="absolute left-3 top-3 rounded-[2px] bg-paper px-2 py-1 text-[12px] font-medium text-ink">New</span>
        )}
        <WishlistButton id={product.id} name={product.name} className="absolute right-3 top-3" />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[13px] text-muted">{product.style}, {product.region.split(',').pop().trim()}</p>
        <h3 className="mt-0.5 text-[15px] font-medium leading-snug">
          <Link href={href} className="hover:underline underline-offset-2">{product.name}</Link>
        </h3>
        {note && <p className="mt-2 text-[14px] italic font-display leading-snug text-ink/80">“{note}”</p>}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[15px] font-semibold price">{formatPrice(product.price)}</p>
          <Rating value={product.rating} count={product.reviews} />
        </div>
        <p className="text-[12px] text-muted">{product.volume}, {product.abv}% ABV</p>
        <button type="button" onClick={() => addItem(product.id)} className="btn-outline mt-3 h-10 w-full">
          Add to bag
        </button>
      </div>
    </article>
  )
}
