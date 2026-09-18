import Head from 'next/head'
import Link from 'next/link'
import { useCartStore, useCartSummary } from '@/store/cartStore'
import { getCategory, formatPrice } from '@/lib/products'
import useHydrated from '@/hooks/useHydrated'
import Bottle from '@/components/Bottle'
import OrderSummary from '@/components/OrderSummary'
import { QtyStepper, DeliveryProgress } from '@/components/CartDrawer'

export default function Cart() {
  const hydrated = useHydrated()
  const { lines, count, subtotal, delivery, total } = useCartSummary()
  const setQty = useCartStore((s) => s.setQty)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <>
      <Head><title>Your bag | Alcohauls</title></Head>
      <div className="wrap pt-10">
        <h1 className="font-display text-[40px] sm:text-[48px]">Your bag</h1>

        {!hydrated ? null : lines.length === 0 ? (
          <div className="mt-8 rounded-[4px] bg-stone px-6 py-20 text-center">
            <p className="font-display text-[26px]">Your bag is empty</p>
            <p className="mt-2 text-muted">Bottles you add will appear here.</p>
            <Link href="/products" className="btn-primary mt-6">Browse the shop</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="text-[14px] text-muted price">{count} {count === 1 ? 'item' : 'items'}</p>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {lines.map(({ id, qty, product }) => (
                  <li key={id} className="flex gap-5 py-6">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex h-32 w-24 shrink-0 items-end justify-center rounded-[3px] pb-2 sm:h-36 sm:w-28"
                      style={{ backgroundColor: getCategory(product.category).tint }}
                    >
                      <Bottle product={product} title={false} className="h-[88%]" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link href={`/products/${product.slug}`} className="text-[16px] font-medium hover:underline">{product.name}</Link>
                          <p className="mt-0.5 text-[13px] text-muted">{product.volume}, {product.abv}% ABV</p>
                          <p className="mt-1 text-[14px] price">{formatPrice(product.price)} each</p>
                        </div>
                        <p className="text-[16px] font-semibold price">{formatPrice(product.price * qty)}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-5 pt-4">
                        <QtyStepper value={qty} onChange={(q) => setQty(id, q)} />
                        <button type="button" onClick={() => removeItem(id)} className="text-[14px] text-muted underline-offset-2 hover:text-ink hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/products" className="mt-6 inline-block text-[14px] font-medium underline underline-offset-4">Continue shopping</Link>
            </div>

            <div className="space-y-4 lg:sticky lg:top-[180px] lg:self-start">
              <DeliveryProgress subtotal={subtotal} />
              <OrderSummary subtotal={subtotal} delivery={delivery} total={total}>
                <Link href="/checkout" className="btn-primary mt-6 h-12 w-full">Check out</Link>
              </OrderSummary>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
