import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Saves a copy of each product (a "card", see lib/catalog.js).
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const items = get().items
        set({
          items: items.some((p) => p.id === product.id)
            ? items.filter((p) => p.id !== product.id)
            : [...items, product],
        })
      },
    }),
    { name: 'alcohauls-saved' }
  )
)
