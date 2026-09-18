import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import AuthShell from '@/components/AuthShell'

export default function Login() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState('')
  const next = typeof router.query.next === 'string' && router.query.next.startsWith('/') ? router.query.next : '/account'

  const submit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    try {
      login({ email: form.get('email'), password: form.get('password') })
      router.push(next)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Head><title>Sign in | Alcohauls</title></Head>
      <AuthShell title="Sign in" intro="Track orders and check out faster.">
        <form onSubmit={submit} className="space-y-4" noValidate={false}>
          {error && <p role="alert" className="rounded-[3px] border border-claret/30 bg-claret/5 px-4 py-3 text-[14px] text-claret">{error}</p>}
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="field" />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
          </div>
          <button type="submit" className="btn-primary h-12 w-full">Sign in</button>
        </form>
        <p className="mt-6 text-[14px] text-muted">
          New to Alcohauls? <Link href={`/auth/register${next !== '/account' ? `?next=${next}` : ''}`} className="font-medium text-ink underline underline-offset-2">Create an account</Link>
        </p>
      </AuthShell>
    </>
  )
}
