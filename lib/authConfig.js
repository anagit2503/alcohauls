// Which ways of signing in are switched on. Kept apart from the NextAuth route so pages can ask the
// question in getStaticProps without pulling NextAuth's server code into the browser bundle.
// Each method stands alone: a half-configured one is left off rather than breaking the others.

const env = process.env

export const googleConfigured = () => Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)

export const appleConfigured = () =>
  Boolean(env.APPLE_ID && env.APPLE_TEAM_ID && env.APPLE_KEY_ID && env.APPLE_PRIVATE_KEY)

// Locally the sign-in link is printed to the terminal, so no mail service is needed. In production a
// link nobody receives is useless, so email sign-in stays off until Resend is set up.
export const emailConfigured = () =>
  Boolean(env.RESEND_API_KEY && env.EMAIL_FROM) || env.NODE_ENV !== 'production'

export const signInMethods = () => {
  if (!env.NEXTAUTH_SECRET) return { google: false, apple: false, email: false }
  return { google: googleConfigured(), apple: appleConfigured(), email: emailConfigured() }
}

export const authConfigured = () => Object.values(signInMethods()).some(Boolean)
