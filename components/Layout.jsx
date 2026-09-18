import Header from './Header'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import AgeGate from './AgeGate'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-paper focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <AgeGate />
    </div>
  )
}
