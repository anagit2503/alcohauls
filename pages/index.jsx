import { useEffect, useState } from 'react'
import Link from 'next/link'
import { productsAPI } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { FiArrowRight } from 'react-icons/fi'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, newProds] = await Promise.all([
          productsAPI.featured(),
          productsAPI.new(),
        ])
        setFeaturedProducts(featured.data.results || featured.data)
        setNewProducts(newProds.data.results || newProds.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-wine-600 to-wine-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Premium Liquor, Delivered
            </h1>
            <p className="text-xl mb-8 text-wine-100">
              Discover the finest selection of bourbon, scotch, wine, tequila, and more. 
              All delivered right to your door.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="btn-primary bg-gold-500 hover:bg-gold-600 text-slate-900">
                Shop Now
              </Link>
              <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-wine-600">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-wine-600 mb-3">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your order delivered in 1-2 business days
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-wine-600 mb-3">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Checkout</h3>
              <p className="text-gray-600">
                Your payment information is encrypted and safe
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-wine-600 mb-3">⭐</div>
              <h3 className="text-xl font-bold mb-2">Best Selection</h3>
              <p className="text-gray-600">
                Curated collection of premium spirits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2>Featured Products</h2>
            <Link href="/products?featured=true" className="flex items-center gap-2 text-wine-600 hover:text-wine-700">
              View All <FiArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid-auto-fit">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card skeleton h-96" />
              ))}
            </div>
          ) : (
            <div className="grid-auto-fit">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-gray-100">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <h2>New Arrivals</h2>
            <Link href="/products?new=true" className="flex items-center gap-2 text-wine-600 hover:text-wine-700">
              View All <FiArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid-auto-fit">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card skeleton h-96" />
              ))}
            </div>
          ) : (
            <div className="grid-auto-fit">
              {newProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="mb-10">Shop by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Bourbon', icon: '🥃' },
              { name: 'Scotch', icon: '🏴󐁧󐁢󐁳󐁣󐁴󐁿' },
              { name: 'Wine', icon: '🍷' },
              { name: 'Tequila', icon: '🌵' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="card p-6 text-center hover:shadow-xl transition"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-bold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-wine-600 text-white section-padding">
        <div className="container-custom max-w-2xl mx-auto text-center">
          <h2 className="mb-4">Get Exclusive Offers</h2>
          <p className="mb-6 text-wine-100">
            Subscribe to our newsletter for deals, new arrivals, and special promotions
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button type="submit" className="btn-primary bg-gold-500 hover:bg-gold-600 text-slate-900">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
