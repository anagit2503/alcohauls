import Head from 'next/head'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import AuthShell from '@/components/AuthShell'

// Where the emailed link lands. Signing in takes a POST with NextAuth's CSRF token, which a plain
// link can't make, so this page makes it. A bad or expired link comes back to /auth/login with an
// error.
export default function Verify() {
  const router = useRouter()
  const started = useRef(false)

  useEffect(() => {
    if (!router.isReady || started.current) return
    started.current = true
    const { token, next } = router.query
    const callbackUrl = typeof next === 'string' && /^\/(?!\/)/.test(next) ? next : '/account'
    if (typeof token !== 'string') {
      router.replace('/auth/login?error=Verification')
      return
    }
    signIn('email', { token, callbackUrl })
  }, [router])

  return (
    <>
      <Head><title>Signing in | Noma Wine &amp; Liquor</title></Head>
      <AuthShell title="Signing you in…" intro="One moment." />
    </>
  )
}
