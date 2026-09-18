import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { authAPI } from '@/lib/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Register user
      register: async (username, email, password, password2, firstName, lastName) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.register({
            username,
            email,
            password,
            password2,
            first_name: firstName,
            last_name: lastName,
          })
          set({ isLoading: false })
          return response.data
        } catch (error) {
          set({ error: error.response?.data?.detail || 'Registration failed', isLoading: false })
          throw error
        }
      },

      // Login user
      login: async (username, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login(username, password)
          const { access, refresh } = response.data

          // Save tokens in cookies
          Cookies.set('access_token', access, { expires: 7 })
          Cookies.set('refresh_token', refresh, { expires: 30 })

          // Fetch user profile
          const profileResponse = await authAPI.getProfile()
          set({
            user: profileResponse.data.user,
            token: access,
            isLoading: false,
          })

          return profileResponse.data
        } catch (error) {
          set({ error: error.response?.data?.detail || 'Login failed', isLoading: false })
          throw error
        }
      },

      // Fetch user profile
      fetchProfile: async () => {
        set({ isLoading: true })
        try {
          const response = await authAPI.getProfile()
          set({
            user: response.data.user,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({ error: error.response?.data?.detail || 'Failed to fetch profile', isLoading: false })
          throw error
        }
      },

      // Update user profile
      updateProfile: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.updateProfile(data)
          set({
            user: response.data.user,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({ error: error.response?.data?.detail || 'Update failed', isLoading: false })
          throw error
        }
      },

      // Logout user
      logout: () => {
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        set({ user: null, token: null, error: null })
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const token = Cookies.get('access_token')
        return !!token
      },

      // Check token and refresh if needed
      checkAuth: async () => {
        const token = Cookies.get('access_token')
        if (!token) {
          set({ user: null, token: null })
          return false
        }

        try {
          const response = await authAPI.getProfile()
          set({
            user: response.data.user,
            token: token,
          })
          return true
        } catch (error) {
          // Try to refresh token
          const refreshToken = Cookies.get('refresh_token')
          if (refreshToken) {
            try {
              const refreshResponse = await authAPI.refreshToken(refreshToken)
              const newToken = refreshResponse.data.access
              Cookies.set('access_token', newToken, { expires: 7 })
              set({ token: newToken })
              
              const profileResponse = await authAPI.getProfile()
              set({ user: profileResponse.data.user })
              return true
            } catch {
              set({ user: null, token: null })
              Cookies.remove('access_token')
              Cookies.remove('refresh_token')
              return false
            }
          }
          return false
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
)
