# Liquor Store Frontend

A premium e-commerce frontend for the liquor store built with Next.js 14, React 18, and Tailwind CSS.

## Features

✅ **Product Browsing** - Browse and search products with filters  
✅ **Shopping Cart** - Add/remove items, update quantities  
✅ **Wishlist** - Save favorite products  
✅ **User Authentication** - Register, login, user profiles  
✅ **Product Ratings** - View and submit ratings/reviews  
✅ **Discount Codes** - Apply promotional codes  
✅ **Order History** - View past orders  
✅ **Responsive Design** - Mobile-first design with Tailwind  
✅ **State Management** - Zustand for cart, auth, wishlist  

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **Icons**: React Icons
- **Authentication**: JWT (stored in cookies)

## Installation

### Prerequisites

- Node.js 16.8+
- npm or yarn

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Liquor Store
```

3. **Run development server**
```bash
npm run dev
```

Application runs at http://localhost:3000

4. **Build for production**
```bash
npm run build
npm start
```

## Project Structure

```
liquor-store-frontend/
├── pages/                          # Next.js pages (routing)
│   ├── _app.jsx                   # App wrapper
│   ├── index.jsx                  # Home page
│   ├── products.jsx               # Products listing
│   ├── cart.jsx                   # Shopping cart
│   ├── wishlist.jsx               # Wishlist page
│   ├── auth/
│   │   ├── login.jsx              # Login page
│   │   ├── register.jsx           # Registration page
│   │   └── forgot-password.jsx    # Password reset
│   ├── orders/
│   │   └── [id].jsx               # Order details
│   ├── account.jsx                # User account
│   └── [slug].jsx                 # Dynamic product page
│
├── components/                     # React components
│   ├── Header.jsx                 # Navigation header
│   ├── Footer.jsx                 # Footer
│   ├── Layout.jsx                 # Main layout
│   ├── ProductCard.jsx            # Product display card
│   ├── SearchBar.jsx              # Search functionality
│   └── StarRating.jsx             # Rating display
│
├── store/                         # Zustand stores (state)
│   ├── authStore.js               # Authentication state
│   ├── cartStore.js               # Shopping cart state
│   └── wishlistStore.js           # Wishlist state
│
├── lib/                           # Utilities
│   └── api.js                     # API functions
│
├── styles/                        # CSS
│   └── globals.css                # Global styles
│
├── public/                        # Static assets
├── .env.example                   # Environment template
├── next.config.js                 # Next.js config
├── tailwind.config.js             # Tailwind config
├── postcss.config.js              # PostCSS config
└── README.md                      # This file
```

## Key Components

### Header
Navigation with search, cart, wishlist, and user account.

### ProductCard
Displays product info, price, rating, add to cart/wishlist buttons.

### StarRating
Interactive star rating display and input.

### Layout
Main wrapper that includes Header and Footer on every page.

## State Management

### Auth Store
```javascript
const { user, login, register, logout, isAuthenticated } = useAuthStore()
```

### Cart Store
```javascript
const { items, total, addItem, removeItem, updateItem, fetchCart } = useCartStore()
```

### Wishlist Store
```javascript
const { products, addProduct, removeProduct, isInWishlist } = useWishlistStore()
```

## API Integration

All API calls are in `lib/api.js`:

```javascript
import { productsAPI, cartAPI, authAPI, ordersAPI } from '@/lib/api'

// Get products
const products = await productsAPI.list()

// Search
const results = await productsAPI.search('bourbon')

// Add to cart
await cartAPI.addItem(productId, quantity)

// Login
await authAPI.login(username, password)
```

## Authentication Flow

1. **Register** → Create account → Automatically logged in
2. **Login** → Get JWT tokens → Stored in cookies
3. **Auto-refresh** → Tokens refresh automatically
4. **Logout** → Tokens cleared

## Forms & Validation

- Client-side validation with HTML5
- Server-side validation by backend
- Error messages displayed to user
- Loading states during API calls

## Styling Guide

Uses Tailwind CSS with custom components:

```css
/* Buttons */
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>

/* Cards */
<div className="card">Content</div>

/* Input */
<input className="input-field" />

/* Badges */
<span className="badge badge-success">Success</span>
```

## Environment Variables

```
NEXT_PUBLIC_API_URL          # Django backend URL
NEXT_PUBLIC_SITE_URL         # Frontend URL
NEXT_PUBLIC_SITE_NAME        # Store name
NEXT_PUBLIC_SQUARE_APP_ID    # Square payment app ID
```

## Deployment to Vercel

### Steps:

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import the GitHub repository
- Add environment variables
- Click "Deploy"

3. **Configure environment**
- Set `NEXT_PUBLIC_API_URL` to production Django URL
- Other public env vars as needed

## Troubleshooting

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure Django backend is running
- Check CORS settings in Django

### Authentication Problems
- Clear browser cookies
- Check token expiration
- Verify JWT secret matches backend

### Styling Not Loading
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

### Images Not Loading
- Check image domains in `next.config.js`
- Verify image URLs from API

## Development Tips

### Hot Reload
Changes to files automatically reload the development server.

### Browser DevTools
- React DevTools for component inspection
- Redux DevTools for Zustand (optional)

### API Testing
Use Postman or similar to test API endpoints independently.

### Debug Mode
Add `?debug=true` to URLs for console logging.

## Performance Optimization

- Images optimized with Next.js Image component
- Code splitting with dynamic imports
- CSS optimization with Tailwind purge
- Lazy loading of components

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security

- JWT tokens in HTTP-only cookies
- CORS validation
- Input sanitization
- HTTPS in production

## Future Enhancements

- Product images carousel
- Customer reviews display
- Advanced filtering
- Wishlist sharing
- Social media integration
- Analytics dashboard

## Support

For issues:
1. Check error messages
2. Review browser console
3. Check API response
4. Contact development team

## License

Proprietary - Liquor Store

---

**Next.js Frontend Ready!** 🚀

Make sure Django backend is running before testing the frontend.
