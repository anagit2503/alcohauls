import { formatPrice } from '@/lib/products'

export default function OrderSummary({ subtotal, delivery, total, children }) {
  return (
    <div className="rounded-[4px] bg-stone p-6">
      <h2 className="font-display text-[22px]">Order summary</h2>
      <dl className="mt-5 space-y-2.5 text-[15px]">
        <div className="flex justify-between"><dt>Subtotal</dt><dd className="price">{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Delivery</dt><dd className="price">{delivery ? formatPrice(delivery) : 'Free'}</dd></div>
        <div className="flex justify-between border-t border-ink/10 pt-3 text-[17px] font-semibold"><dt>Total</dt><dd className="price">{formatPrice(total)}</dd></div>
      </dl>
      <p className="mt-1 text-[12px] text-muted">Includes sales tax.</p>
      {children}
    </div>
  )
}
