/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Lets the browser know whether products are real (from Square) or the demo catalogue.
    NEXT_PUBLIC_CATALOG: process.env.SQUARE_ACCESS_TOKEN ? 'square' : 'demo',
  },
}

module.exports = nextConfig
