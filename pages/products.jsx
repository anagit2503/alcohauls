import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { productsAPI, categoriesAPI } from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { FiFilter, FiX } from 'react-icons/fi'

export default function Products() {
  const router = useRouter()
  const { search, category, sort } = router.query

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(category || '')
  const [selectedSort, setSelectedSort] = useState(sort || '-created_at')
  const [searchQuery, setSearchQuery] = useState(search || '')

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.list()
        setCategories(response.data.results || response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let response
        if (searchQuery) {
          response = await productsAPI.search(searchQuery)
          setProducts(Array.isArray(response.data) ? response.data : response.data.results)
        } else {
          const params = {}
          if (selectedCategory) params.category = selectedCategory
          if (selectedSort) params.ordering = selectedSort
          response = await productsAPI.list(params)
          setProducts(response.data.results || response.data)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (router.isReady) {
      fetchProducts()
    }
  }, [router.isReady, selectedCategory, selectedSort, searchQuery])

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
    router.push(`/products?category=${catId}`)
  }

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue)
    router.push(`/products?sort=${sortValue}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery}`)
    }
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedSort('-created_at')
    setSearchQuery('')
    router.push('/products')
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4">Our Collection</h1>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`w-64 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
                  <FiX />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      !selectedCategory
                        ? 'bg-wine-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        selectedCategory == cat.id
                          ? 'bg-wine-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                      <span className="text-xs ml-2">({cat.product_count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Sort By</h4>
                <select
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="-created_at">Newest</option>
                  <option value="created_at">Oldest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-average_rating">Highest Rated</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden btn-outline mb-6 flex items-center gap-2"
            >
              <FiFilter /> Show Filters
            </button>

            {/* Results Count */}
            <p className="text-gray-600 mb-6">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>

            {/* Products Grid */}
            {loading ? (
              <div className="grid-auto-fit">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card skeleton h-96" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid-auto-fit">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
