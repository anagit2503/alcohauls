import Head from 'next/head'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import { getProduct } from '@/lib/products'
import useHydrated from '@/hooks/useHydrated'
import ProductCard from '@/components/ProductCard'

export default function Wishlist() {
  const hydrated = useHydrated()
  const ids = useWishlistStore((s) => s.ids)
  const products = ids.map(getProduct).filter(Boolean)

  return (
    <>
      <Head><title>Wishlist | Alcohauls</title></Head>
      <div className="wrap pt-10">
        <h1 className="font-display text-[40px] sm:text-[48px]">Wishlist</h1>
        {!hydrated ? null : products.length === 0 ? (
          <div className="mt-8 rounded-[4px] bg-stone px-6 py-20 text-center">
            <p className="font-display text-[26px]">Nothing saved yet</p>
            <p className="mt-2 text-muted">Tap the heart on any bottle to save it here for later.</p>
            <Link href="/products" className="btn-primary mt-6">Browse the shop</Link>
          </div>
        ) : (
          <>
            <p className="mt-1 text-muted price">{products.length} saved {products.length === 1 ? 'bottle' : 'bottles'}</p>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </>
  )
}
