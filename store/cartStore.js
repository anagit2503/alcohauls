import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartAPI } from '@/lib/api'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isLoading: false,
      error: null,

      // Fetch cart from API
      fetchCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartAPI.get()
          set({
            items: response.data.items,
            total: parseFloat(response.data.cart_total),
            itemCount: response.data.item_count,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch cart',
            isLoading: false,
          })
          // Return empty cart if not authenticated
          return { items: [], cart_total: '0.00', item_count: 0 }
        }
      },

      // Add item to cart
      addItem: async (productId, quantity = 1) => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartAPI.addItem(productId, quantity)
          set({
            items: response.data.items,
            total: parseFloat(response.data.cart_total),
            itemCount: response.data.item_count,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to add item',
            isLoading: false,
          })
          throw error
        }
      },

      // Update item quantity
      updateItem: async (itemId, quantity) => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartAPI.updateItem(itemId, quantity)
          set({
            items: response.data.items,
            total: parseFloat(response.data.cart_total),
            itemCount: response.data.item_count,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to update item',
            isLoading: false,
          })
          throw error
        }
      },

      // Remove item from cart
      removeItem: async (itemId) => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartAPI.removeItem(itemId)
          set({
            items: response.data.items,
            total: parseFloat(response.data.cart_total),
            itemCount: response.data.item_count,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to remove item',
            isLoading: false,
          })
          throw error
        }
      },

      // Clear cart
      clearCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await cartAPI.clear()
          set({
            items: [],
            total: 0,
            itemCount: 0,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to clear cart',
            isLoading: false,
          })
          throw error
        }
      },

      // Get cart subtotal
      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          return sum + parseFloat(item.item_total)
        }, 0)
      },

      // Check if product is in cart
      isInCart: (productId) => {
        return get().items.some((item) => item.product.id === productId)
      },

      // Get item from cart
      getItem: (productId) => {
        return get().items.find((item) => item.product.id === productId)
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
