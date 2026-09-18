import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============= Authentication API =============
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (username, password) =>
    api.post('/auth/token/', { username, password }),
  refreshToken: (refreshToken) =>
    api.post('/auth/token/refresh/', { refresh: refreshToken }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
}

// ============= Products API =============
export const productsAPI = {
  list: (params) => api.get('/products/', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}/`),
  getById: (id) => api.get(`/products/${id}/`),
  featured: () => api.get('/products/featured/'),
  new: () => api.get('/products/new/'),
  bestSellers: () => api.get('/products/best_sellers/'),
  search: (query) => api.get('/search/', { params: { q: query } }),
}

// ============= Categories API =============
export const categoriesAPI = {
  list: () => api.get('/categories/'),
  getBySlug: (slug) => api.get(`/categories/${slug}/`),
  getById: (id) => api.get(`/categories/${id}/`),
}

// ============= Cart API =============
export const cartAPI = {
  get: () => api.get('/cart/'),
  addItem: (productId, quantity) =>
    api.post('/cart/add/', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) =>
    api.put(`/cart/update/${itemId}/`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}/`),
  clear: () => api.post('/cart/clear/'),
}

// ============= Wishlist API =============
export const wishlistAPI = {
  get: () => api.get('/wishlist/'),
  add: (productId) => api.post(`/wishlist/add/${productId}/`),
  remove: (productId) => api.delete(`/wishlist/remove/${productId}/`),
}

// ============= Orders API =============
export const ordersAPI = {
  list: () => api.get('/orders/'),
  getByNumber: (orderNumber) => api.get(`/orders/${orderNumber}/`),
  create: (data) => api.post('/orders/create/', data),
}

// ============= Ratings API =============
export const ratingsAPI = {
  list: (params) => api.get('/ratings/', { params }),
  getForProduct: (productId) =>
    api.get('/ratings/product_ratings/', { params: { product_id: productId } }),
  create: (data) => api.post('/ratings/', data),
}

// ============= Discounts API =============
export const discountsAPI = {
  list: () => api.get('/discounts/'),
  validateCode: (code) =>
    api.post('/discounts/validate_code/', { code }),
}

// ============= Payments API =============
export const paymentsAPI = {
  processPayment: (data) => api.post('/payment/process/', data),
}

export default api
