import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import AuthShell from '@/components/AuthShell'

export default function Register() {
  const router = useRouter()
  const register = useAuthStore((s) => s.register)
  const [error, setError] = useState('')
  const next = typeof router.query.next === 'string' && router.query.next.startsWith('/') ? router.query.next : '/account'

  const submit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (form.get('password').length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }
    try {
      register({ name: form.get('name'), email: form.get('email'), password: form.get('password') })
      router.push(next)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Head><title>Create an account | Alcohauls</title></Head>
      <AuthShell title="Create an account" intro="Save your details, keep a wishlist and see past orders.">
        <form onSubmit={submit} className="space-y-4">
          {error && <p role="alert" className="rounded-[3px] border border-claret/30 bg-claret/5 px-4 py-3 text-[14px] text-claret">{error}</p>}
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" name="name" autoComplete="name" required className="field" />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="field" />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className="field" aria-describedby="pw-hint" />
            <p id="pw-hint" className="mt-1.5 text-[13px] text-muted">At least 8 characters.</p>
          </div>
          <label className="flex items-start gap-2.5 text-[14px]">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-bottle" />
            I confirm I am 21 or over.
          </label>
          <button type="submit" className="btn-primary h-12 w-full">Create account</button>
        </form>
        <p className="mt-6 text-[14px] text-muted">
          Already have an account? <Link href="/auth/login" className="font-medium text-ink underline underline-offset-2">Sign in</Link>
        </p>
      </AuthShell>
    </>
  )
}
