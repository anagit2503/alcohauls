import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/store/authStore'
import { formatPrice } from '@/lib/products'
import useHydrated from '@/hooks/useHydrated'

export default function Account() {
  const router = useRouter()
  const hydrated = useHydrated()
  const user = useAuthStore((s) => s.user)
  const orders = useAuthStore((s) => s.orders)
  const logout = useAuthStore((s) => s.logout)

  if (!hydrated) return null

  if (!user) {
    return (
      <div className="wrap max-w-lg pt-16 text-center">
        <h1 className="font-display text-[38px]">Your account</h1>
        <p className="mt-2 text-muted">Sign in to see your orders and saved details.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/auth/login" className="btn-primary">Sign in</Link>
          <Link href="/auth/register" className="btn-outline">Create an account</Link>
        </div>
      </div>
    )
  }

  const mine = orders.filter((o) => o.email?.toLowerCase() === user.email)

  return (
    <>
      <Head><title>Your account | Alcohauls</title></Head>
      <div className="wrap pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[40px] sm:text-[48px]">Hello, {user.name.split(' ')[0]}</h1>
            <p className="text-muted">{user.email}</p>
          </div>
          <button type="button" onClick={() => { logout(); router.push('/') }} className="btn-outline">Sign out</button>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-[26px]">Orders</h2>
          {mine.length === 0 ? (
            <div className="mt-4 rounded-[4px] bg-stone px-6 py-12 text-center">
              <p className="text-muted">You haven’t placed an order yet.</p>
              <Link href="/products" className="btn-primary mt-5">Browse the shop</Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {mine.map((o) => (
                <li key={o.number} className="grid gap-2 py-5 sm:grid-cols-[160px_1fr_auto] sm:gap-6">
                  <div>
                    <p className="font-semibold">{o.number}</p>
                    <p className="text-[13px] text-muted">{new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <p className="text-[14px] text-ink/85">
                    {o.items.map((i) => `${i.qty} × ${i.name}`).join(', ')}
                  </p>
                  <p className="font-semibold price">{formatPrice(o.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
