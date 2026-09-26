import Head from 'next/head'
import { useRouter } from 'next/router'
import AuthShell from '@/components/AuthShell'
import GoogleButton from '@/components/GoogleButton'
import { authConfigured } from '@/lib/authConfig'

// NextAuth reports failures back here as ?error=. Only a few are worth explaining; anything else
// gets a generic line rather than a code the shopper can't act on.
const ERRORS = {
  AccessDenied: 'That Google account has no verified email address, so we can’t sign you in with it.',
  OAuthAccountNotLinked: 'That email is already signed in with a different method.',
  Configuration: 'Sign-in isn’t set up correctly. Please try again later.',
  Verification: 'That sign-in link has expired. Try again.',
}

export default function Login({ googleEnabled }) {
  const router = useRouter()
  const next = typeof router.query.next === 'string' && router.query.next.startsWith('/') ? router.query.next : '/account'
  const error = typeof router.query.error === 'string' ? router.query.error : ''

  return (
    <>
      <Head><title>Sign in | Noma Wine &amp; Liquor</title></Head>
      <AuthShell title="Sign in" intro="Track orders and check out faster.">
        {error && (
          <p role="alert" className="mb-5 rounded-[3px] border border-claret/30 bg-claret/5 px-4 py-3 text-[14px] text-claret">
            {ERRORS[error] || 'We couldn’t sign you in. Please try again.'}
          </p>
        )}

        {googleEnabled ? (
          <>
            <GoogleButton next={next} />
            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              Signing in creates your account the first time. You must be 21 or over to order.
            </p>
          </>
        ) : (
          <p className="rounded-[3px] border border-line bg-stone px-4 py-3 text-[14px] text-muted">
            Google sign-in isn’t switched on yet. Add <code>GOOGLE_CLIENT_ID</code>,{' '}
            <code>GOOGLE_CLIENT_SECRET</code> and <code>NEXTAUTH_SECRET</code> to <code>.env.local</code>.
          </p>
        )}
      </AuthShell>
    </>
  )
}

export function getStaticProps() {
  return { props: { googleEnabled: authConfigured() } }
}
