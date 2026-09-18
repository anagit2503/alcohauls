import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { X, Minus, Plus } from '@phosphor-icons/react'
import { useCartStore, useCartSummary } from '@/store/cartStore'
import { FREE_DELIVERY_THRESHOLD, formatPrice } from '@/lib/products'
import Bottle from './Bottle'

export function QtyStepper({ value, onChange, size = 'sm' }) {
  const h = size === 'sm' ? 'h-9' : 'h-11'
  return (
    <div className={`inline-flex ${h} items-center rounded-[3px] border border-line bg-white`}>
      <button type="button" onClick={() => onChange(value - 1)} className="flex h-full w-9 items-center justify-center text-ink hover:bg-stone" aria-label="Decrease quantity">
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-[14px] font-medium price" aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} className="flex h-full w-9 items-center justify-center text-ink hover:bg-stone" aria-label="Increase quantity">
        <Plus size={14} />
      </button>
    </div>
  )
}

export function DeliveryProgress({ subtotal }) {
  const left = FREE_DELIVERY_THRESHOLD - subtotal
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  return (
    <div>
      <p className="text-[13px] text-ink">
        {left > 0
          ? <>Add <span className="font-semibold price">{formatPrice(left)}</span> more for free delivery</>
          : 'Your order qualifies for free delivery'}
      </p>
      <div className="mt-2 h-1 rounded-full bg-line">
        <div className="h-1 rounded-full bg-brass transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const close = useCartStore((s) => s.close)
  const setQty = useCartStore((s) => s.setQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const { lines, count, subtotal } = useCartSummary()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <div className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-paper shadow-2xl outline-none transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-[22px]">Your bag <span className="text-muted text-[16px] font-sans price">({count})</span></h2>
          <button type="button" onClick={close} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone" aria-label="Close bag">
            <X size={20} weight="light" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-display text-[22px]">Your bag is empty</p>
            <p className="mt-2 text-muted">Find something for tonight.</p>
            <Link href="/products" onClick={close} className="btn-primary mt-6">Browse the shop</Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4"><DeliveryProgress subtotal={subtotal} /></div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map(({ id, qty, product }) => (
                <li key={id} className="flex gap-4 py-5">
                  <Link href={`/products/${product.slug}`} onClick={close} className="flex h-24 w-16 shrink-0 items-end justify-center rounded-[3px] bg-stone">
                    <Bottle product={product} title={false} className="h-[88px]" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <Link href={`/products/${product.slug}`} onClick={close} className="text-[14px] font-medium leading-snug hover:underline">
                        {product.name}
                      </Link>
                      <p className="text-[14px] font-medium price">{formatPrice(product.price * qty)}</p>
                    </div>
                    <p className="mt-0.5 text-[13px] text-muted">{product.volume}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper value={qty} onChange={(q) => setQty(id, q)} />
                      <button type="button" onClick={() => removeItem(id)} className="text-[13px] text-muted underline-offset-2 hover:text-ink hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-5">
              <div className="flex justify-between text-[15px]">
                <span>Subtotal</span>
                <span className="font-semibold price">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-[13px] text-muted">Delivery is calculated at checkout.</p>
              <div className="mt-4 grid gap-2">
                <Link href="/checkout" onClick={close} className="btn-primary w-full">Check out</Link>
                <Link href="/cart" onClick={close} className="btn-outline w-full">View bag</Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
