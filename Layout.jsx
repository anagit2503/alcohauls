'use client'

import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useAuthStore } from '@/store/authStore'

export default function Layout({ children }) {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    // Check authentication on mount
    checkAuth()
  }, [checkAuth])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  )
}
