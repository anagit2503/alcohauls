import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SignJWT, importPKCS8 } from 'jose'
import { googleConfigured, appleConfigured, emailConfigured } from '@/lib/authConfig'
import { readEmailToken } from '@/lib/emailLink'

// Sign in with Google, Apple, or a link sent by email. Each is switched on by its settings in
// .env.local (see .env.example); NEXTAUTH_SECRET is needed for all of them.
//
// Sessions are JSON Web Tokens held in an httpOnly cookie, so there's no database to run. The
// trade-off is that nothing about a shopper is stored server-side: past orders still live in the
// browser. Moving orders onto the account means adding a database and a NextAuth adapter.

// Apple wants a "client secret" that is itself a JWT signed with the .p8 key, valid for at most six
// months. Making a fresh one here saves anyone having to remember to renew it.
let appleSecret = null
async function appleClientSecret() {
  if (appleSecret && appleSecret.expires > Date.now()) return appleSecret.value
  const key = await importPKCS8(process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 'ES256')
  const value = await new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: process.env.APPLE_KEY_ID })
    .setIssuer(process.env.APPLE_TEAM_ID)
    .setSubject(process.env.APPLE_ID)
    .setAudience('https://appleid.apple.com')
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key)
  appleSecret = { value, expires: Date.now() + 12 * 60 * 60 * 1000 }
  return value
}

// Apple returns the shopper with a cross-site POST, and browsers don't send SameSite=Lax cookies on
// those. The cookies NextAuth checks on the way back therefore have to be SameSite=None, which
// browsers only allow over https — fine, because Apple only redirects to https sites anyway.
const secure = (process.env.NEXTAUTH_URL || '').startsWith('https://')
const returnCookie = (name, maxAge) => ({
  name: `${secure ? '__Secure-' : ''}next-auth.${name}`,
  options: { httpOnly: true, sameSite: secure ? 'none' : 'lax', path: '/', secure, ...(maxAge && { maxAge }) },
})

async function providers() {
  const list = []
  if (googleConfigured()) {
    list.push(GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Always show the account chooser: a shared machine shouldn't silently sign in as whoever
      // used it last, least of all in a shop that sells alcohol.
      authorization: { params: { prompt: 'select_account' } },
    }))
  }
  if (appleConfigured()) {
    list.push(AppleProvider({ clientId: process.env.APPLE_ID, clientSecret: await appleClientSecret() }))
  }
  if (emailConfigured()) {
    list.push(CredentialsProvider({
      id: 'email',
      name: 'Email',
      credentials: { token: { type: 'text' } },
      // The token comes from the link in the email (see pages/api/email-link.js).
      async authorize(credentials) {
        const email = await readEmailToken(credentials?.token)
        return email ? { id: email, email, name: null } : null
      },
    }))
  }
  return list
}

export async function authOptions() {
  return {
    providers: await providers(),
    session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
    pages: { signIn: '/auth/login', error: '/auth/login' },
    cookies: {
      pkceCodeVerifier: returnCookie('pkce.code_verifier', 15 * 60),
      state: returnCookie('state', 15 * 60),
      callbackUrl: returnCookie('callback-url'),
    },
    callbacks: {
      // Only accounts with a verified email get in. An unverified one proves nothing about who is
      // ordering. Apple verifies every address it hands over, including its private relay ones.
      async signIn({ account, profile }) {
        if (account?.provider === 'google') return profile?.email_verified === true
        if (account?.provider === 'apple') return Boolean(profile?.email)
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
}

export default async function auth(req, res) {
  return NextAuth(req, res, await authOptions())
}
