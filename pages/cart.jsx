import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Cart() {
  const router = useRouter()
  const { items, total, fetchCart, updateItem, removeItem, isLoading, error } = useCartStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user, fetchCart])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity === 0) {
      await removeItem(itemId)
    } else {
      await updateItem(itemId, newQuantity)
    }
  }

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from your cart?')) {
      await removeItem(itemId)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  if (!user) {
    return (
      <div className="section-padding">
        <div className="container-custom">
          <div className="text-center py-12">
            <h1 className="mb-4">Your Shopping Cart</h1>
            <p className="text-gray-600 mb-6">
              Please log in to view your cart
            </p>
            <Link href="/auth/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="mb-8">Your Shopping Cart</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6 text-lg">
              Your cart is empty
            </p>
            <Link href="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-6 border-b last:border-b-0"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-24 h-24 flex-shrink-0"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-semibold text-gray-900 hover:text-wine-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {item.product.brand} • {item.product.volume}
                      </p>
                      <p className="text-wine-600 font-bold mt-2">
                        ${parseFloat(item.product.final_price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center border border-gray-300 rounded-lg mb-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-100"
                          disabled={isLoading}
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-100"
                          disabled={isLoading}
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                        disabled={isLoading}
                      >
                        <FiTrash2 size={16} />
                        Remove
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Total</p>
                      <p className="font-bold text-lg">
                        ${parseFloat(item.item_total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 h-fit sticky top-24">
                <h3 className="font-bold text-lg mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-wine-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <Link
                  href="/products"
                  className="btn-secondary w-full text-center"
                >
                  Continue Shopping
                </Link>

                {/* Discount Code */}
                <div className="mt-6 pt-6 border-t">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="input-field w-full text-sm mb-2"
                  />
                  <button className="btn-outline w-full text-sm">
                    Apply Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
