import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

// Square's hosted card fields. The card number never touches this site or its server — the SDK
// renders the inputs inside an iframe on Square's own domain and hands back a single-use token,
// which is what the checkout API charges. That is what keeps card data out of PCI scope here.

const APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
const ENVIRONMENT = process.env.NEXT_PUBLIC_SQUARE_PAYMENTS_ENVIRONMENT === 'production' ? 'production' : 'sandbox'

const SDK_URL = ENVIRONMENT === 'production'
  ? 'https://web.squarecdn.com/v1/square.js'
  : 'https://sandbox.web.squarecdn.com/v1/square.js'

export const cardPaymentsReady = () => Boolean(APP_ID && LOCATION_ID)

let sdkPromise = null
function loadSdk() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.Square) return Promise.resolve(window.Square)
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SDK_URL
    s.async = true
    s.onload = () => (window.Square ? resolve(window.Square) : reject(new Error('Square SDK failed to load')))
    s.onerror = () => { sdkPromise = null; reject(new Error('Square SDK failed to load')) }
    document.head.appendChild(s)
  })
  return sdkPromise
}

// Exposes tokenize() to the checkout form: returns a single-use card token, or throws with a
// message worth showing to the shopper.
const SquareCard = forwardRef(function SquareCard(_props, ref) {
  const container = useRef(null)
  const card = useRef(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!cardPaymentsReady()) { setStatus('unconfigured'); return }
    let cancelled = false
    let attached = null

    loadSdk()
      .then(async (Square) => {
        const payments = Square.payments(APP_ID, LOCATION_ID)
        const instance = await payments.card()
        if (cancelled) { instance.destroy(); return }
        await instance.attach(container.current)
        attached = instance
        card.current = instance
        setStatus('ready')
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setStatus('error') } })

    return () => {
      cancelled = true
      card.current = null
      // destroy() detaches the iframe; ignore it racing with an unmount mid-attach.
      if (attached) attached.destroy().catch(() => {})
    }
  }, [])

  useImperativeHandle(ref, () => ({
    ready: () => status === 'ready',
    async tokenize() {
      if (!card.current) throw new Error('The card form isn’t ready yet. Give it a moment.')
      const result = await card.current.tokenize()
      if (result.status !== 'OK') {
        const detail = result.errors?.[0]?.message
        throw new Error(detail || 'Check the card details and try again.')
      }
      return result.token
    },
  }), [status])

  if (status === 'unconfigured') {
    return (
      <p className="mt-4 rounded-[3px] border border-line bg-stone px-4 py-3 text-[14px] text-muted">
        Card payments aren’t switched on yet. Add <code>NEXT_PUBLIC_SQUARE_APP_ID</code> and{' '}
        <code>NEXT_PUBLIC_SQUARE_LOCATION_ID</code> to <code>.env.local</code>.
      </p>
    )
  }

  return (
    <div className="mt-4">
      <div ref={container} className="min-h-[90px] rounded-[3px] border border-line bg-white px-3 py-2" />
      {status === 'loading' && <p className="mt-2 text-[13px] text-muted">Loading secure card form…</p>}
      {status === 'error' && <p role="alert" className="mt-2 text-[13px] text-claret">{error}</p>}
      {ENVIRONMENT === 'sandbox' && status === 'ready' && (
        <p className="mt-2 text-[13px] text-muted">
          Test mode — no real money moves. Use card <span className="price">4111 1111 1111 1111</span>, any future expiry, CVV <span className="price">111</span>, postcode <span className="price">10001</span>.
        </p>
      )}
    </div>
  )
})

export default SquareCard
