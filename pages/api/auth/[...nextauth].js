import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Sign in with Google.
//
//   GOOGLE_CLIENT_ID      from Google Cloud Console > APIs & Services > Credentials
//   GOOGLE_CLIENT_SECRET  the matching secret. Server-only: never prefix it with NEXT_PUBLIC_.
//   NEXTAUTH_SECRET       signs the session cookie. Generate with: openssl rand -base64 32
//   NEXTAUTH_URL          the site's own URL. Needed in production; inferred locally.
//
// Sessions are JSON Web Tokens held in an httpOnly cookie, so there's no database to run. The
// trade-off is that nothing about a shopper is stored server-side: past orders still live in the
// browser. Moving orders onto the account means adding a database and a NextAuth adapter.

export const authConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET)

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Always show the account chooser: a shared machine shouldn't silently sign in as whoever
      // used it last, least of all in a shop that sells alcohol.
      authorization: { params: { prompt: 'select_account' } },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: '/auth/login', error: '/auth/login' },
  callbacks: {
    // Only Google accounts with a verified email get in. An unverified one proves nothing about
    // who is ordering.
    async signIn({ account, profile }) {
      if (account?.provider === 'google') return profile?.email_verified === true
      return true
    },
    async jwt({ token, profile }) {
      if (profile?.picture) token.picture = profile.picture
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.image = token.picture || session.user.image || null
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
