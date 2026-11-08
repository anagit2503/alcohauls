import { SignJWT, jwtVerify } from 'jose'

// Passwordless email sign-in. The link carries a short-lived token signed with NEXTAUTH_SECRET, so
// nothing is stored: whoever can open mail at that address can sign in as it.
//
// NextAuth's own EmailProvider would need a database to hold one-time tokens. Without one, a link
// can be used more than once until it expires, which is why it expires quickly.

const AUDIENCE = 'noma:email-sign-in'
export const LINK_MINUTES = 15

const key = () => new TextEncoder().encode(process.env.NEXTAUTH_SECRET)

export const normaliseEmail = (value) => String(value || '').trim().toLowerCase()
export const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254

export async function createEmailToken(email) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${LINK_MINUTES}m`)
    .sign(key())
}

// The email the token was issued for, or null if it's forged, altered or expired.
export async function readEmailToken(token) {
  try {
    const { payload } = await jwtVerify(String(token || ''), key(), { audience: AUDIENCE })
    return looksLikeEmail(payload.email) ? payload.email : null
  } catch {
    return null
  }
}

export async function sendSignInEmail(email, url) {
  const text = `Sign in to Noma Wine & Liquor:\n\n${url}\n\nThis link works for ${LINK_MINUTES} minutes. If you didn't ask for it, ignore this email.`

  if (!process.env.RESEND_API_KEY) {
    // Local development only: authConfig keeps email sign-in off in production without Resend.
    console.log(`\n[email sign-in] Link for ${email}:\n${url}\n`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your sign-in link',
      text,
      html: `<p>Sign in to Noma Wine &amp; Liquor:</p>
<p><a href="${url}" style="display:inline-block;padding:12px 20px;background:#1f3a2d;color:#fff;text-decoration:none;border-radius:3px">Sign in</a></p>
<p style="color:#666;font-size:13px">This link works for ${LINK_MINUTES} minutes. If you didn't ask for it, ignore this email.</p>`,
    }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
}
