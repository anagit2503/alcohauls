import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistAPI } from '@/lib/api'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,

      // Fetch wishlist from API
      fetchWishlist: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await wishlistAPI.get()
          set({
            products: response.data.products,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to fetch wishlist',
            isLoading: false,
          })
          // Return empty wishlist if not authenticated
          return { products: [] }
        }
      },

      // Add product to wishlist
      addProduct: async (productId) => {
        set({ isLoading: true, error: null })
        try {
          const response = await wishlistAPI.add(productId)
          set({
            products: response.data.products,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to add to wishlist',
            isLoading: false,
          })
          throw error
        }
      },

      // Remove product from wishlist
      removeProduct: async (productId) => {
        set({ isLoading: true, error: null })
        try {
          const response = await wishlistAPI.remove(productId)
          set({
            products: response.data.products,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Failed to remove from wishlist',
            isLoading: false,
          })
          throw error
        }
      },

      // Toggle product in wishlist
      toggleProduct: async (productId) => {
        const isInWishlist = get().isInWishlist(productId)
        if (isInWishlist) {
          return get().removeProduct(productId)
        } else {
          return get().addProduct(productId)
        }
      },

      // Check if product is in wishlist
      isInWishlist: (productId) => {
        return get().products.some((product) => product.id === productId)
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'wishlist-store',
      partialize: (state) => ({
        products: state.products,
      }),
    }
  )
)
