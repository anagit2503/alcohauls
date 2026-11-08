// Emails a sign-in link. The reply is the same whether or not the address has signed in before, so
// this can't be used to find out who shops here.

import { emailConfigured } from '@/lib/authConfig'
import { createEmailToken, sendSignInEmail, normaliseEmail, looksLikeEmail } from '@/lib/emailLink'

// One link per address per minute. Held per server instance, so it slows a flood rather than
// stopping it outright.
const lastSent = new Map()
const WAIT_MS = 60 * 1000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!process.env.NEXTAUTH_SECRET || !emailConfigured()) {
    return res.status(503).json({ error: 'Email sign-in isn’t switched on.' })
  }

  const email = normaliseEmail(req.body?.email)
  if (!looksLikeEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' })

  const now = Date.now()
  if (now - (lastSent.get(email) || 0) < WAIT_MS) {
    return res.status(429).json({ error: 'We’ve just sent a link. Check your inbox, or try again in a minute.' })
  }
  lastSent.set(email, now)
  if (lastSent.size > 5000) lastSent.clear()

  const next = typeof req.body?.next === 'string' && /^\/(?!\/)/.test(req.body.next) ? req.body.next : '/account'
  const base = (process.env.NEXTAUTH_URL || `http://${req.headers.host}`).replace(/\/$/, '')
  const url = `${base}/auth/verify?${new URLSearchParams({ token: await createEmailToken(email), next })}`

  try {
    await sendSignInEmail(email, url)
  } catch (err) {
    lastSent.delete(email)
    console.error('[email sign-in] send failed:', err.message)
    return res.status(502).json({ error: 'We couldn’t send the email. Please try again.' })
  }
  return res.status(200).json({ sent: true })
}
