'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { FaHeart, FaStar } from 'react-icons/fa'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import StarRating from './StarRating'

export default function ProductCard({ product }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { user } = useAuthStore()
  const { isInWishlist, toggleProduct } = useWishlistStore()
  const { addItem } = useCartStore()

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    setIsAddingToCart(true)
    try {
      await addItem(product.id, 1)
      // Show success message (you can add a toast here)
      alert('Added to cart!')
    } catch (error) {
      alert('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to use wishlist')
      return
    }
    try {
      await toggleProduct(product.id)
    } catch (error) {
      alert('Failed to update wishlist')
    }
  }

  const finalPrice = parseFloat(product.final_price)
  const regularPrice = parseFloat(product.price)
  const discountPercent = product.discounted_price
    ? Math.round((1 - finalPrice / regularPrice) * 100)
    : 0

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card overflow-hidden cursor-pointer group h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.is_featured && (
              <div className="badge badge-success">Featured</div>
            )}
            {product.is_new && (
              <div className="badge bg-blue-100 text-blue-800">New</div>
            )}
            {discountPercent > 0 && (
              <div className="badge bg-red-100 text-red-800">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? (
              <FaHeart size={16} className="text-wine-600" />
            ) : (
              <FiHeart size={16} className="text-gray-600" />
            )}
          </button>

          {/* Stock Status */}
          {!product.is_in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category & Brand */}
          <p className="text-xs text-gray-500 mb-1">
            {product.category_name} • {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-sm mb-2 truncate-2 text-gray-900">
            {product.name}
          </h3>

          {/* Volume & ABV */}
          <p className="text-xs text-gray-600 mb-3">
            {product.volume}
            {product.abv && ` • ${product.abv}% ABV`}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={product.average_rating} size={14} readOnly />
            <span className="text-xs text-gray-600">
              ({product.total_ratings})
            </span>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-wine-600">
                ${finalPrice.toFixed(2)}
              </span>
              {product.discounted_price && (
                <span className="text-sm text-gray-500 line-through">
                  ${regularPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock || isAddingToCart}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-auto"
          >
            <FiShoppingCart size={16} />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
