'use client'

import Link from 'next/link'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-gray-300 mt-20">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              Premium liquor store delivering the finest spirits, wines, and beers to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-gold-500">Shop</Link></li>
              <li><Link href="/categories" className="hover:text-gold-500">Categories</Link></li>
              <li><Link href="/about" className="hover:text-gold-500">About</Link></li>
              <li><Link href="/contact" className="hover:text-gold-500">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/orders" className="hover:text-gold-500">Track Orders</Link></li>
              <li><Link href="/faq" className="hover:text-gold-500">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-gold-500">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-gold-500">Returns</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <p className="text-sm mb-2">
              <span className="font-semibold">Email:</span><br/>
              <a href="mailto:info@liquorstore.com" className="hover:text-gold-500">
                info@liquorstore.com
              </a>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Phone:</span><br/>
              <a href="tel:+1234567890" className="hover:text-gold-500">
                (123) 456-7890
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} Liquor Store. All rights reserved. Must be 21+ to purchase.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-gold-500" title="Facebook">
              <FiFacebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gold-500" title="Twitter">
              <FiTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gold-500" title="Instagram">
              <FiInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gold-500" title="LinkedIn">
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs text-gray-400 border-t border-gray-700 pt-6">
          <Link href="/privacy" className="hover:text-gold-500">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-gold-500">Terms of Service</Link>
          <span>•</span>
          <Link href="/accessibility" className="hover:text-gold-500">Accessibility</Link>
          <span>•</span>
          <Link href="/sitemap" className="hover:text-gold-500">Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}
