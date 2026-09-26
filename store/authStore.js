import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Who is signed in is NextAuth's job (Google only) — see hooks/useUser.js.
// This store now only keeps past orders, which still live in the browser rather than on the
// account, because sessions are JWT-only and there's no database behind them. Signing in on a
// second device shows an empty history until orders move server-side.
export const useAuthStore = create(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
    }),
    { name: 'alcohauls-auth' }
  )
)
