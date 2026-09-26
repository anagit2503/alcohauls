# Alcohauls

An online bottle shop built with Next.js, Tailwind CSS and Zustand. It runs on its own with a
built-in demo catalogue, and shows a real shop's products once Square is connected.

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Connecting Square

Without a Square token the site shows the demo bottles in `lib/products.js`. To show a real shop's
products, copy `.env.example` to `.env.local` and fill in the token:

```bash
cp .env.example .env.local
```

| Setting | What it does |
| --- | --- |
| `SQUARE_ACCESS_TOKEN` | The shop's Square token. Empty means demo products. |
| `SQUARE_ENVIRONMENT` | `production` for the real shop, `sandbox` for Square's test account. |
| `SQUARE_LOCATION_ID` | Optional. Count stock at one location only. |
| `SQUARE_ONLINE_CATEGORY` | Optional. Only show items in this Square category, e.g. `Online`. |
| `SQUARE_HIDDEN_CATEGORIES` | Optional. Hide these categories, e.g. `Cigarettes,Snacks`. |
| `SQUARE_HIDE_SOLD_OUT` | Optional. `true` removes sold-out items instead of labelling them. |

`.env.local` is never committed. On Vercel, add the same settings under
Project Settings → Environment Variables, then redeploy.

### What comes from Square

Names, descriptions, prices, sizes, photos, categories and stock counts. Pages refresh from Square
every 5 minutes (`REVALIDATE` in `lib/catalog.js`), so price and stock changes appear without a
redeploy. An item sold in several sizes becomes one listing per size. Items without a photo get an
illustrated bottle drawn from `components/Bottle.jsx`.

The shop controls the home page from Square by putting items in categories named **Featured**,
**Staff Picks** or **New Arrivals**.

Square holds no ratings, tasting notes or ABV, so those only appear on demo products.

## Project structure

```
pages/            Routes: home, shop, product, bag, checkout, wishlist, account, auth, help
components/       Header, Footer, cart drawer, product card, age check, illustrated bottles
store/            Bag, wishlist and account state (Zustand, saved in the browser)
lib/products.js   Demo catalogue, categories and price formatting
lib/square.js     Loads products from the Square Catalog and Inventory APIs
lib/catalog.js    Chooses Square or demo data and trims products for page props
styles/           Tailwind setup and base styles
```

## Not built yet

- **Payments and orders.** Checkout collects details and shows a confirmation, but takes no payment
  and sends nothing to Square. That needs Square's Web Payments SDK and Orders API.
- **Real accounts.** Sign-in, the bag and the wishlist are saved in the visitor's own browser only.
  They don't sync between devices and aren't secure enough for real customer accounts.
