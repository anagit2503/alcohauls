import Head from 'next/head'
import { useRouter } from 'next/router'
import AuthShell from '@/components/AuthShell'
import GoogleButton from '@/components/GoogleButton'
import AppleButton from '@/components/AppleButton'
import EmailSignIn from '@/components/EmailSignIn'
import { signInMethods } from '@/lib/authConfig'

// NextAuth reports failures back here as ?error=. Only a few are worth explaining; anything else
// gets a generic line rather than a code the shopper can't act on.
const ERRORS = {
  AccessDenied: 'That account has no verified email address, so we can’t sign you in with it.',
  Configuration: 'Sign-in isn’t set up correctly. Please try again later.',
  Verification: 'That sign-in link has expired. Try again.',
  CredentialsSignin: 'That sign-in link has expired or isn’t valid. Ask for a new one below.',
}

export default function Login({ methods }) {
  const router = useRouter()
  const next = typeof router.query.next === 'string' && /^\/(?!\/)/.test(router.query.next) ? router.query.next : '/account'
  const error = typeof router.query.error === 'string' ? router.query.error : ''
  const anyButton = methods.google || methods.apple

  return (
    <>
      <Head><title>Sign in | Noma Wine &amp; Liquor</title></Head>
      <AuthShell title="Sign in" intro="Track orders and check out faster.">
        {error && (
          <p role="alert" className="mb-5 rounded-[3px] border border-claret/30 bg-claret/5 px-4 py-3 text-[14px] text-claret">
            {ERRORS[error] || 'We couldn’t sign you in. Please try again.'}
          </p>
        )}

        {anyButton || methods.email ? (
          <>
            <div className="space-y-3">
              {methods.apple && <AppleButton next={next} />}
              {methods.google && <GoogleButton next={next} />}
            </div>
            {anyButton && methods.email && (
              <div className="my-6 flex items-center gap-4 text-[13px] text-muted">
                <span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" />
              </div>
            )}
            {methods.email && <EmailSignIn next={next} />}
            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              Signing in creates your account the first time. You must be 21 or over to order.
            </p>
          </>
        ) : (
          <p className="rounded-[3px] border border-line bg-stone px-4 py-3 text-[14px] text-muted">
            Sign-in isn’t switched on yet. Add <code>NEXTAUTH_SECRET</code> and at least one sign-in method
            to <code>.env.local</code> (see <code>.env.example</code>).
          </p>
        )}
      </AuthShell>
    </>
  )
}

export function getStaticProps() {
  return { props: { methods: signInMethods() } }
}
