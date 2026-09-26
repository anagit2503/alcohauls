import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MIN_ORDER, DELIVERY_FEE } from '@/lib/products'

const MAX_QTY = 24

// Each line keeps a copy of the product (a "card", see lib/catalog.js) taken when it was added,
// so the bag works on every page without loading the whole catalogue.
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ id, qty, product }]
      isOpen: false,

      addItem: (product, qty = 1) => {
        const items = get().items
        const limit = product.stock == null ? MAX_QTY : Math.min(MAX_QTY, product.stock)
        const existing = items.find((i) => i.id === product.id)
        set({
          items: existing
            ? items.map((i) => (i.id === product.id ? { ...i, product, qty: Math.min(i.qty + qty, limit) } : i))
            : [...items, { id: product.id, qty: Math.min(qty, limit), product }],
          isOpen: true,
        })
      },
      setQty: (id, qty) => {
        if (qty < 1) return get().removeItem(id)
        set({
          items: get().items.map((i) => {
            if (i.id !== id) return i
            const limit = i.product.stock == null ? MAX_QTY : Math.min(MAX_QTY, i.product.stock)
            return { ...i, qty: Math.min(qty, limit) }
          }),
        })
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: 'alcohauls-bag', partialize: (s) => ({ items: s.items }) }
  )
)

export function useCartSummary() {
  const lines = useCartStore((s) => s.items).filter((l) => l.product)
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
  const delivery = subtotal === 0 ? 0 : DELIVERY_FEE
  const shortfall = Math.max(0, MIN_ORDER - subtotal)
  return { lines, count, subtotal, delivery, total: subtotal + delivery, shortfall, meetsMinimum: subtotal > 0 && shortfall === 0 }
}
