# Solea — Full-Stack E-commerce (Next.js + MongoDB)

A complete e-commerce app: storefront, filtering/search, related products, cart,
checkout, auth, and an admin dashboard — all in one Next.js app using the App Router
and API routes as the backend.

## Stack
- Next.js 14 (App Router, JS)
- MongoDB + Mongoose
- Tailwind CSS
- JWT auth (httpOnly cookie) + bcrypt password hashing

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   - `MONGODB_URI` — your MongoDB connection string (local `mongodb://127.0.0.1:27017/solea`
     or a MongoDB Atlas URI)
   - `JWT_SECRET` — any long random string

3. **Seed sample data** (5 products + an admin account)
   ```bash
   npm run seed
   ```
   This creates an admin login:
   - email: `admin@solea.test`
   - password: `Admin123!`

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

5. **Admin dashboard**
   Log in with the admin account above, then visit http://localhost:3000/admin

## Project structure

```
src/
  app/
    page.js                 Home
    shop/page.js             Product listing + filters
    product/[slug]/page.js   Product detail + related products
    cart/page.js              Cart (localStorage-based)
    checkout/page.js          Checkout -> creates an order
    orders/[id]/page.js       Order confirmation
    login/, register/         Auth pages
    admin/                    Admin dashboard (guarded)
      page.js                 Overview (revenue, low stock, etc.)
      products/                Product CRUD table + form
      orders/                  Order list + status updates
    api/                      Backend — all REST endpoints
      products/                Public product list/detail/related
      auth/                    register/login/me
      orders/                  Checkout + order history
      admin/                   Admin-only product/order/stat endpoints
  components/                Reusable UI (Navbar, ProductCard, Filters, CartContext, AddToCart)
  models/                    Mongoose schemas (Product, User, Order)
  lib/                       db.js (connection), auth.js (JWT/bcrypt helpers)
scripts/seed.js              Sample data + admin user
```

## Key functionality implemented

- **Product filtering**: category, gender, color, size, price range, text search,
  sorting (price/rating/newest), pagination — with live facet counts returned by
  the API so the filter UI reflects real available options.
- **Related products**: ranked by same category first, then by number of shared
  tags, then rating — computed server-side via a Mongo aggregation.
- **Cart**: client-side, persisted to `localStorage`, quantity/size/color aware.
- **Checkout**: requires login; prices are recalculated server-side from the
  database (never trusts client-submitted prices).
- **Auth**: JWT stored in an httpOnly cookie; `role: "admin" | "customer"` on the
  User model gates access to `/admin/*` pages and `/api/admin/*` routes.
- **Admin dashboard**: revenue/orders/products/customers overview, low-stock
  alerts, full product CRUD, and order status management.

## Extending this

- Swap the placeholder checkout for a real payment provider (Stripe, Razorpay,
  etc.) by adding a payment step before `Order` is marked `isPaid`.
- Add image upload (e.g. Cloudinary/S3) instead of pasting image URLs in the
  admin product form.
- Add product reviews as a sub-document or separate collection.
- Deploy: works well on Vercel (app) + MongoDB Atlas (database). Set the same
  env vars from `.env.example` in your hosting provider's dashboard.
