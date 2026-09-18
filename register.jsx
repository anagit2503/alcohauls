import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const { register } = useAuthStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions')
      return
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.password2,
        formData.firstName,
        formData.lastName
      )
      
      // Redirect to login
      router.push('/auth/login?registered=true')
    } catch (err) {
      const errorMessage = err.response?.data?.detail ||
        (typeof err.response?.data === 'object'
          ? Object.values(err.response?.data)?.[0]?.[0]
          : 'Registration failed. Please try again.')
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="section-padding">
      <div className="container-custom max-w-md">
        <div className="card p-8">
          <h1 className="mb-2">Create Account</h1>
          <p className="text-gray-600 mb-8">Join us for premium spirits</p>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Choose a username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Minimum 8 characters"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-wine-600 hover:text-wine-700">
                  terms and conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-wine-600 hover:text-wine-700 font-semibold">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
