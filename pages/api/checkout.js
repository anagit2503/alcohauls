// Places an order and charges the card. The browser sends only product ids, quantities and the
// one-time card token from Square's SDK — never prices. Everything that decides how much is
// charged is worked out here, from the live catalogue.

import { usingSquare } from '@/lib/catalog'
import { fetchSquareItemsByIds } from '@/lib/square'
import { PRODUCTS as DEMO_PRODUCTS, isAvailable, MIN_ORDER, DELIVERY_FEE } from '@/lib/products'
import { createOrderAndPayment, paymentsConfigured, paymentsEnvironment } from '@/lib/squarePayments'

const MAX_QTY = 24

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!paymentsConfigured()) {
    return res.status(503).json({
      error: 'This shop can’t take card payments yet. Add the Square payment credentials to .env.local.',
    })
  }

  const { sourceId, idempotencyKey, items, name, email, phone, address, slot } = req.body || {}

  if (!sourceId || !idempotencyKey) return res.status(400).json({ error: 'Missing card details.' })
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Your bag is empty.' })
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' })

  try {
    // Quantities are checked before any network call, so a nonsense basket costs nothing.
    const wanted = []
    for (const item of items) {
      const qty = Number(item?.qty)
      if (!item?.id || typeof item.id !== 'string') {
        return res.status(400).json({ error: 'One of the bottles in your bag is no longer sold.' })
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
        return res.status(400).json({ error: `Choose between 1 and ${MAX_QTY} of each bottle.` })
      }
      wanted.push({ id: item.id, qty })
    }

    // Price only what's being bought, straight from Square. Never from anything the browser sent.
    const byId = usingSquare()
      ? await fetchSquareItemsByIds(wanted.map((w) => w.id))
      : new Map(DEMO_PRODUCTS.map((p) => [p.id, p]))

    const lines = []
    for (const { id, qty } of wanted) {
      const product = byId.get(id)
      if (!product) return res.status(400).json({ error: 'One of the bottles in your bag is no longer sold.' })
      if (!isAvailable(product)) return res.status(409).json({ error: `${product.name} has just sold out.` })
      if (product.stock != null && qty > product.stock) {
        return res.status(409).json({ error: `Only ${product.stock} left of ${product.name}.` })
      }
      lines.push({ id, name: product.name, price: product.price, qty })
    }

    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
    // Checked here as well as in the browser: the minimum is a rule about what the shop will
    // deliver, so it can't be something a caller is able to skip past.
    if (subtotal < MIN_ORDER) {
      return res.status(400).json({ error: `Orders start at $${MIN_ORDER}. Add a little more to your bag.` })
    }
    const delivery = DELIVERY_FEE
    const total = subtotal + delivery

    const note = [slot, address].filter(Boolean).join(' · ')
    const { order, payment } = await createOrderAndPayment({
      sourceId,
      idempotencyKey,
      lines,
      delivery,
      total,
      buyer: { email, phone },
      note,
    })

    return res.status(200).json({
      orderId: order.id,
      paymentId: payment.id,
      receiptUrl: payment.receipt_url || null,
      status: payment.status,
      subtotal,
      delivery,
      total: (payment.amount_money?.amount ?? 0) / 100,
      lines,
    })
  } catch (err) {
    // Square's raw detail reads like "Authorization error: 'GENERIC_DECLINE'", which means nothing
    // to a shopper. Say what went wrong and what to do about it instead.
    const DECLINES = {
      CARD_DECLINED: 'Your bank declined the card. Try another card, or check with them.',
      GENERIC_DECLINE: 'Your bank declined the card. Try another card, or check with them.',
      INSUFFICIENT_FUNDS: 'There aren’t enough funds on that card.',
      CVV_FAILURE: 'That security code doesn’t match the card. Check the CVV and try again.',
      ADDRESS_VERIFICATION_FAILURE: 'The billing postcode doesn’t match the card. Check it and try again.',
      EXPIRATION_FAILURE: 'That expiry date isn’t valid. Check it and try again.',
      CARD_EXPIRED: 'That card has expired. Try another one.',
      INVALID_CARD: 'Those card details aren’t valid. Check them and try again.',
      CARD_DECLINED_VERIFICATION_REQUIRED: 'Your bank needs to verify this payment. Try another card.',
    }
    const friendly = DECLINES[err.squareCode]
    if (!friendly) {
      console.error(`[checkout] ${paymentsEnvironment()} payment failed:`, err.squareCode || '', err.message)
    }
    return res.status(friendly ? 402 : 500).json({
      error: friendly || 'We couldn’t take that payment. No money has left your account.',
      code: err.squareCode || null,
    })
  }
}
