import { useEffect, useState } from 'react'

const KEY = 'alcohauls-age-ok'

export default function AgeGate() {
  const [show, setShow] = useState(false)
  const [refused, setRefused] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== 'yes') setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  if (!show) return null

  const confirm = () => {
    try { localStorage.setItem(KEY, 'yes') } catch {}
    setShow(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bottle-dark/90 p-4" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div className="w-full max-w-md rounded-[4px] bg-paper px-8 py-10 text-center shadow-2xl">
        <p className="font-display text-[30px] leading-none">Alcohauls</p>
        {refused ? (
          <>
            <h2 id="age-title" className="mt-8 text-[18px] font-semibold">You need to be 21 or over to use this site</h2>
            <p className="mt-2 text-muted">Come back when you’re of legal drinking age.</p>
          </>
        ) : (
          <>
            <h2 id="age-title" className="mt-8 text-[18px] font-semibold">Are you 21 or over?</h2>
            <p className="mt-2 text-muted">You must be of legal drinking age to browse and buy.</p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRefused(true)} className="btn-outline">No</button>
              <button type="button" onClick={confirm} className="btn-primary" autoFocus>Yes, I’m 21+</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
