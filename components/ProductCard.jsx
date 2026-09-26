import Link from 'next/link'
import { Heart } from '@phosphor-icons/react'
import { getCategory, formatPrice, isAvailable } from '@/lib/products'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import useHydrated from '@/hooks/useHydrated'
import { ProductImage } from './Bottle'
import Rating from './Rating'

export function WishlistButton({ product, className = '' }) {
  const hydrated = useHydrated()
  const saved = useWishlistStore((s) => s.items.some((p) => p.id === product.id))
  const toggle = useWishlistStore((s) => s.toggle)
  const on = hydrated && saved
  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={on}
      aria-label={on ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_1px_2px_rgba(21,32,27,0.12)] hover:bg-white ${className}`}
    >
      <Heart size={18} weight={on ? 'fill' : 'light'} className={on ? 'text-claret' : ''} />
    </button>
  )
}

// "Red, France" for the demo catalogue; the Square category name otherwise.
export function productKicker(p) {
  const country = p.region ? p.region.split(',').pop().trim() : ''
  return [p.style, country].filter(Boolean).join(', ') || getCategory(p.category)?.name
}

export function productSpecs(p) {
  return [p.volume, p.abv != null ? `${p.abv}% ABV` : ''].filter(Boolean).join(', ')
}

export default function ProductCard({ product, note }) {
  const addItem = useCartStore((s) => s.addItem)
  const cat = getCategory(product.category)
  const href = `/products/${product.slug}`
  const available = isAvailable(product)
  const specs = productSpecs(product)

  return (
    <article className="group flex flex-col">
      <div className="relative">
        <Link
          href={href}
          className={`flex aspect-[4/5] justify-center overflow-hidden rounded-[3px] ${product.image ? 'items-center p-[10%]' : 'items-end pb-[6%]'}`}
          style={{ backgroundColor: product.image ? '#FFFFFF' : cat?.tint }}
          aria-label={product.name}
        >
          <ProductImage
            product={product}
            title={false}
            className={`transition-transform duration-500 ease-out group-hover:-translate-y-1.5 ${available ? '' : 'opacity-50'}`}
            bottleClassName={`h-[82%] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 ${available ? '' : 'opacity-50'}`}
          />
        </Link>
        {!available ? (
          <span className="absolute left-3 top-3 rounded-[2px] bg-ink px-2 py-1 text-[12px] font-medium text-paper">Sold out</span>
        ) : product.tags.includes('new') && (
          <span className="absolute left-3 top-3 rounded-[2px] bg-paper px-2 py-1 text-[12px] font-medium text-ink">New</span>
        )}
        <WishlistButton product={product} className="absolute right-3 top-3" />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-[13px] text-muted">{productKicker(product)}</p>
        <h3 className="mt-0.5 text-[15px] font-medium leading-snug">
          <Link href={href} className="hover:underline underline-offset-2">{product.name}</Link>
        </h3>
        {note && <p className="mt-2 text-[14px] italic font-display leading-snug text-ink/80">“{note}”</p>}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[15px] font-semibold price">{formatPrice(product.price, product.currency)}</p>
          {product.rating != null && <Rating value={product.rating} count={product.reviews} />}
        </div>
        {specs && <p className="text-[12px] text-muted">{specs}</p>}
        <div className="mt-auto pt-3">
          <button type="button" onClick={() => addItem(product)} disabled={!available} className="btn-outline h-10 w-full">
            {available ? 'Add to bag' : 'Sold out'}
          </button>
        </div>
      </div>
    </article>
  )
}
