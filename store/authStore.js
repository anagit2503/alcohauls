import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Demo accounts live only in this browser. Swap for real API calls once the backend exists.
export const useAuthStore = create(
  persist(
    (set, get) => ({
      accounts: [], // [{ name, email, password }]
      user: null,
      orders: [],

      register: ({ name, email, password }) => {
        const key = email.trim().toLowerCase()
        if (get().accounts.some((a) => a.email === key)) {
          throw new Error('An account with this email already exists. Sign in instead.')
        }
        const account = { name: name.trim(), email: key, password }
        set({ accounts: [...get().accounts, account], user: { name: account.name, email: key } })
      },
      login: ({ email, password }) => {
        const key = email.trim().toLowerCase()
        const account = get().accounts.find((a) => a.email === key)
        if (!account || account.password !== password) {
          throw new Error('That email and password don’t match. Check them and try again.')
        }
        set({ user: { name: account.name, email: key } })
      },
      logout: () => set({ user: null }),
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
    }),
    { name: 'alcohauls-auth' }
  )
)
