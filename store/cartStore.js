import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProduct, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '@/lib/products'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ id, qty }]
      isOpen: false,

      addItem: (id, qty = 1) => {
        const items = get().items
        const existing = items.find((i) => i.id === id)
        set({
          items: existing
            ? items.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, 24) } : i))
            : [...items, { id, qty }],
          isOpen: true,
        })
      },
      setQty: (id, qty) => {
        if (qty < 1) return get().removeItem(id)
        set({ items: get().items.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 24) } : i)) })
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: 'alcohauls-cart', partialize: (s) => ({ items: s.items }) }
  )
)

// Resolves cart lines to products and works out totals.
export function useCartSummary() {
  const items = useCartStore((s) => s.items)
  const lines = items
    .map((i) => ({ ...i, product: getProduct(i.id) }))
    .filter((l) => l.product)
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  return { lines, count, subtotal, delivery, total: subtotal + delivery }
}
