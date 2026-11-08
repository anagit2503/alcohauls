import { useState } from 'react'

// Asks for an email address and sends a sign-in link to it. No password to set or forget.
export default function EmailSignIn({ next = '/account' }) {
  const [sentTo, setSentTo] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const send = async (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/email-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, next }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'We couldn’t send the email. Please try again.')
      setSentTo(email)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (sentTo) {
    return (
      <div className="rounded-[3px] border border-line bg-stone px-4 py-4 text-[14px]">
        <p className="font-medium text-ink">Check your inbox</p>
        <p className="mt-1 text-muted">
          We’ve sent a sign-in link to {sentTo}. It works for 15 minutes.{' '}
          <button type="button" onClick={() => setSentTo('')} className="text-ink underline underline-offset-2">Use a different email</button>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={send}>
      <label htmlFor="signin-email" className="label">Email</label>
      <input id="signin-email" name="email" type="email" autoComplete="email" required className="field" />
      {error && <p role="alert" className="mt-2 text-[14px] text-claret">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary mt-3 h-12 w-full disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? 'Sending…' : 'Email me a sign-in link'}
      </button>
    </form>
  )
}
