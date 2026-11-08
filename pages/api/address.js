// Checks a delivery address with USPS before the shopper pays. /api/checkout checks it again, so
// this is here to catch mistakes early, not to enforce anything.

import { uspsConfigured, verifyAddress, readAddress } from '@/lib/usps'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const entered = readAddress(req.body?.address)
  // Without USPS, or while it's down, the address is taken as typed. `checked` tells the page.
  if (!uspsConfigured()) return res.status(200).json({ ok: true, checked: false, address: entered })

  try {
    const result = await verifyAddress(entered)
    return res.status(200).json({ ...result, checked: result.ok })
  } catch (err) {
    console.error('[address] USPS unavailable:', err.message)
    return res.status(200).json({ ok: true, checked: false, address: entered })
  }
}
