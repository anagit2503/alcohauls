import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrap max-w-lg pt-20 text-center">
      <h1 className="font-display text-[44px]">Page not found</h1>
      <p className="mt-2 text-muted">The link may be old, or the bottle may have sold out. Try the shop instead.</p>
      <Link href="/products" className="btn-primary mt-6">Browse the shop</Link>
    </div>
  )
}
