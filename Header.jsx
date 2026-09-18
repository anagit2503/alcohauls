'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import SearchBar from './SearchBar'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuthStore()
  const { itemCount } = useCartStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-wine-600 text-white text-sm py-2">
        <div className="container-custom flex justify-center">
          <p>Premium Liquor Delivered to Your Door 🍷</p>
        </div>
      </div>

      {/* Main Header */}
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold gradient-text">
            LiquorStore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-wine-600 font-medium">
              Shop
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-wine-600 font-medium">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-wine-600 font-medium">
              About
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop Only */}
            <div className="hidden lg:block">
              <SearchBar />
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="btn-icon relative"
              title="Wishlist"
            >
              <FiHeart size={20} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="btn-icon relative"
              title="Shopping Cart"
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-wine-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {user ? (
              <div className="relative group">
                <button className="btn-icon" title="Account">
                  <FiUser size={20} />
                </button>
                <div className="absolute right-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition mt-2">
                  <Link
                    href="/account"
                    className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg border-t"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm py-1 px-4">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn-icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mt-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link
              href="/products"
              className="block px-4 py-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {!user && (
              <Link
                href="/auth/login"
                className="block btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
