import { useEffect, useState } from 'react'

// Saved cart/wishlist state only exists in the browser; render it after mount
// so server and client HTML match.
export default function useHydrated() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return ready
}
