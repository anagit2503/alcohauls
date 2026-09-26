import Head from 'next/head'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { CheckCircle } from '@phosphor-icons/react'
import { useCartStore, useCartSummary } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import useUser from '@/hooks/useUser'
import { formatPrice, MIN_ORDER } from '@/lib/products'
import useHydrated from '@/hooks/useHydrated'
import OrderSummary from '@/components/OrderSummary'
import SquareCard, { cardPaymentsReady } from '@/components/SquareCard'

const SLOTS = ['Today, 5pm to 7pm', 'Today, 7pm to 9pm', 'Tomorrow, 10am to 12pm', 'Tomorrow, 2pm to 4pm']

function Field({ label, id, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} name={id} className="field" required {...props} />
    </div>
  )
}

export default function Checkout() {
  const hydrated = useHydrated()
  const { lines, subtotal, delivery, total, shortfall, meetsMinimum } = useCartSummary()
  const clearCart = useCartStore((s) => s.clearCart)
  const { user } = useUser()
  const addOrder = useAuthStore((s) => s.addOrder)
  const [slot, setSlot] = useState(SLOTS[0])
  const [placed, setPlaced] = useState(null)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const cardRef = useRef(null)

  // One key per attempt at this basket. Retrying after a decline reuses it, so a double-submit
  // can never charge twice; a genuinely new order gets a new key.
  const idempotencyKey = useRef(null)
  if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID()

  const placeOrder = async (e) => {
    e.preventDefault()
    if (paying) return
    const form = new FormData(e.currentTarget)
    if (!meetsMinimum) {
      setPayError(`Orders start at ${formatPrice(MIN_ORDER)}. Add ${formatPrice(shortfall)} more to your bag.`)
      return
    }
    setPayError('')
    setPaying(true)

    try {
      const sourceId = await cardRef.current.tokenize()

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          idempotencyKey: idempotencyKey.current,
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          address: [form.get('address'), form.get('city'), form.get('state'), form.get('zip')]
            .filter(Boolean).join(', '),
          slot,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'That payment didn’t go through.')

      const order = {
        number: data.orderId.slice(-8).toUpperCase(),
        date: new Date().toISOString(),
        name: form.get('name'),
        email: form.get('email'),
        slot,
        total: data.total,
        receiptUrl: data.receiptUrl,
        items: data.lines.map((l) => ({ id: l.id, qty: l.qty, name: l.name, price: l.price })),
      }
      addOrder(order)
      clearCart()
      setPlaced(order)
      window.scrollTo(0, 0)
    } catch (err) {
      setPayError(err.message)
      // A fresh key: the failed attempt is spent, and Square rejects a reused one on new details.
      idempotencyKey.current = crypto.randomUUID()
    } finally {
      setPaying(false)
    }
  }

  if (placed) {
    return (
      <div className="wrap max-w-2xl pt-16 text-center">
        <CheckCircle size={52} weight="light" className="mx-auto text-bottle" />
        <h1 className="mt-4 font-display text-[40px] leading-tight">Order placed</h1>
        <p className="mt-3 text-[16px] text-muted">
          Thanks, {placed.name.split(' ')[0]}. Your order <span className="font-semibold text-ink">{placed.number}</span> arrives {placed.slot.charAt(0).toLowerCase() + placed.slot.slice(1)}.
          We’ve sent a confirmation to {placed.email}.
        </p>
        <p className="mt-2 text-[14px] text-muted">Have photo ID ready. The driver will check that you’re 21 or over.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/products" className="btn-primary">Keep shopping</Link>
          {user && <Link href="/account" className="btn-outline">View orders</Link>}
          {placed.receiptUrl && (
            <a href={placed.receiptUrl} target="_blank" rel="noreferrer" className="btn-outline">View receipt</a>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Head><title>Checkout | Noma Wine &amp; Liquor</title></Head>
      <div className="wrap pt-10">
        <h1 className="font-display text-[40px] sm:text-[48px]">Checkout</h1>

        {!hydrated ? null : lines.length === 0 ? (
          <div className="mt-8 rounded-[4px] bg-stone px-6 py-20 text-center">
            <p className="font-display text-[26px]">Your bag is empty</p>
            <p className="mt-2 text-muted">Add a few bottles before checking out.</p>
            <Link href="/products" className="btn-primary mt-6">Browse the shop</Link>
          </div>
        ) : (
          <form onSubmit={placeOrder} className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
            <div className="space-y-10">
              <fieldset>
                <legend className="font-display text-[24px]">Contact</legend>
                {!user && (
                  <p className="mt-1 text-[14px] text-muted">
                    Have an account? <Link href="/auth/login?next=/checkout" className="text-ink underline underline-offset-2">Sign in</Link>
                  </p>
                )}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" id="name" autoComplete="name" defaultValue={user?.name} />
                  <Field label="Email" id="email" type="email" autoComplete="email" defaultValue={user?.email} />
                  <Field label="Phone" id="phone" type="tel" autoComplete="tel" />
                  <Field label="Date of birth" id="dob" type="date" max={new Date(Date.now() - 21 * 365.25 * 864e5).toISOString().slice(0, 10)} />
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-display text-[24px]">Delivery address</legend>
                <div className="mt-4 grid gap-4 sm:grid-cols-6">
                  <Field label="Street address" id="address" autoComplete="street-address" className="sm:col-span-6" />
                  <Field label="City" id="city" autoComplete="address-level2" className="sm:col-span-3" />
                  <Field label="State" id="state" autoComplete="address-level1" className="sm:col-span-1" />
                  <Field label="ZIP code" id="zip" autoComplete="postal-code" inputMode="numeric" className="sm:col-span-2" />
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-display text-[24px]">Delivery time</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {SLOTS.map((s) => (
                    <label key={s} className={`flex cursor-pointer items-center gap-3 rounded-[3px] border px-4 py-3.5 text-[15px] ${slot === s ? 'border-bottle bg-bottle/[0.04] ring-1 ring-bottle' : 'border-line bg-white hover:border-ink/40'}`}>
                      <input type="radio" name="slot" value={s} checked={slot === s} onChange={() => setSlot(s)} className="accent-bottle" />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-display text-[24px]">Payment</legend>
                <p className="mt-1 text-[14px] text-muted">Card details go straight to Square. They never reach this site.</p>
                <SquareCard ref={cardRef} />
              </fieldset>
            </div>

            <div className="lg:sticky lg:top-[180px] lg:self-start">
              <OrderSummary subtotal={subtotal} delivery={delivery} total={total}>
                <ul className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-[14px]">
                  {lines.map(({ id, qty, product }) => (
                    <li key={id} className="flex justify-between gap-4">
                      <span className="text-ink/85"><span className="price">{qty} ×</span> {product.name}</span>
                      <span className="price">{formatPrice(qty * product.price)}</span>
                    </li>
                  ))}
                </ul>
                {payError && (
                  <p role="alert" className="mt-5 rounded-[3px] border border-claret/30 bg-claret/5 px-4 py-3 text-[14px] text-claret">{payError}</p>
                )}
                {!meetsMinimum && (
                  <p className="mt-5 rounded-[3px] border border-line bg-stone px-4 py-3 text-[14px] text-muted">
                    Orders start at {formatPrice(MIN_ORDER)}. Add {formatPrice(shortfall)} more to check out.
                  </p>
                )}
                <button type="submit" disabled={paying || !meetsMinimum || !cardPaymentsReady()} className="btn-primary mt-6 h-12 w-full disabled:cursor-not-allowed disabled:opacity-60">
                  {paying ? 'Taking payment…' : `Place order, ${formatPrice(total)}`}
                </button>
                <p className="mt-3 text-[12px] text-muted">By placing your order you confirm you are 21 or over. ID is checked on delivery.</p>
              </OrderSummary>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
