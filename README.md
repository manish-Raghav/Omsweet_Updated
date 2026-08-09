# OmSweet

A full-stack React storefront for a sweets, bakery and cold-drinks shop \u2014
signup/login, cart, address, payment, order history, category pages with
top-sellers and filters, product detail pages, and an admin area for adding
products and viewing a dashboard.

- **Frontend**: React + Redux Toolkit (`/src`)
- **Backend**: Node + Express + MongoDB (Mongoose) + JWT auth (`/backend`)

The frontend talks to the backend over a REST API (`src/services/api.js`).
The shopping cart and the in-progress checkout address live in the browser
(as is normal for a cart) \u2014 everything else (users, products, orders) is
real data in MongoDB via the API.

## Running the whole thing

You need **MongoDB** (local install, or a free MongoDB Atlas cluster) and
**two terminals** \u2014 one for the API, one for the frontend.

**Terminal 1 \u2014 backend**
```bash
cd backend
npm install
cp .env
# edit .env: set MONGO_URI to your local Mongo instance or Atlas connection string
npm run seed   # creates the product catalogue + demo admin account
npm run dev
```
This starts the API on `http://localhost:5000`.

**Terminal 2 \u2014 frontend**
```bash
npm install
cp .env
npm run dev
```
This starts the app on `http://localhost:5173` (Vite will print the exact
URL). It's already configured to call the API at `http://localhost:5000/api`
via `VITE_API_URL` in `.env`.

Open the frontend URL in your browser \u2014 the shop, cart, checkout, and admin
area are all live against the real backend at this point.

## Demo accounts

**Admin** (created by `npm run seed`, using the `ADMIN_*` values in
`backend/.env`):
- Email: `admin@omsweet.com`
- Password: `admin123`

**Customer**: sign up for a new account from the "Sign up" page.

## What's included

- **Signup / Login** \u2014 real backend auth: bcrypt-hashed passwords (via a
  Mongoose pre-save hook), JWTs issued on login/signup and verified on every
  protected request
- **Nav: Sweet / Bakery** \u2014 dedicated category pages with a "top selling"
  showcase, a price filter, and a sort control (top sold / price / name)
- **Product detail page** \u2014 click any product card for full details and an
  add-to-cart action, plus related items from the same category
- **Cart** \u2014 add, increase/decrease quantity, remove items, free-delivery
  threshold logic (client-side, as usual for a cart)
- **Checkout** \u2014 address form, then payment (Card / UPI / Cash on delivery;
  payment itself is mocked, but the order is real and persisted in MongoDB)
- **Order placement is server-authoritative** \u2014 the client only sends
  product ids + quantities; the server recomputes every line-item price and
  the total from the live catalogue, and bumps each product's `sold` counter
  (which is what powers the "top selling" sections)
- **Order history** \u2014 `/api/orders/mine`, shown on the "My orders" page
- **About / Contact pages**, a **Footer** on every page
- **Admin dashboard** \u2014 live stats (products, orders, registered users,
  revenue) and a recent-orders table, pulled from the backend
- **Admin: Add Product** (upload an image file, or paste an image URL) and
  **Manage Products** (remove items) \u2014 both hit real API endpoints

## Project structure

```
backend/                     # Express + MongoDB API (see backend's own layout below)
  src/
    server.js                  # entry point: loads env, connects Mongo, starts Express
    app.js                      # Express app: middleware, routes, error handling
    config/db.js                 # Mongoose connection
    models/                      # User, Product, Order (Mongoose schemas)
    repositories/                # data-access layer used by controllers
    controllers/                 # auth, product, order request handlers
    routes/                       # auth.routes.js, product.routes.js, order.routes.js
    middlewares/                  # JWT auth guard, multer upload, central error handler
    seed/                         # seed product catalogue + seed script (`npm run seed`)
  uploads/                      # image files saved by the admin "upload from device" option

src/                          # React frontend
  services/api.js               # fetch client for the backend
  store/                        # Redux Toolkit slices + store.js
    authSlice.js                  # signup/login/refreshSession, current user, admin user list
    productsSlice.js              # catalogue fetch/add/remove
    cartSlice.js                   # cart contents (client-side)
    ordersSlice.js                 # place order, my orders, all orders (admin)
    checkoutSlice.js               # in-progress checkout address (client-side)
  components/                    # Header, Footer, ProductCard, route guards
  pages/                          # Home, About, Contact, CategoryPage, ProductDetail,
                                   # Login, Signup, Cart, Address, Payment, OrderSuccess, Orders
  pages/admin/                     # AdminDashboard, AddProduct, ManageProducts
```

## API reference

All request/response bodies are JSON (product creation also accepts
multipart/form-data for a real file upload). Authenticated routes expect
`Authorization: Bearer <token>`.

| Method | Path              | Auth  | Notes                                        |
|--------|-------------------|-------|-----------------------------------------------|
| POST   | /api/auth/signup  | \u2013     | `{ name, email, password }` \u2192 `{ token, user }` |
| POST   | /api/auth/login   | \u2013     | `{ email, password }` \u2192 `{ token, user }`        |
| GET    | /api/auth/me      | Yes   | current user                                   |
| GET    | /api/auth/users   | Admin | all registered users                           |
| GET    | /api/products     | \u2013     | supports `?cat=&search=&minPrice=&maxPrice=&sort=&limit=` |
| GET    | /api/products/:id | \u2013     | single product                                 |
| POST   | /api/products     | Admin | create (JSON with an `image` URL, or multipart with an `image` file) |
| DELETE | /api/products/:id | Admin | remove                                         |
| POST   | /api/orders       | Yes   | `{ items: [{ id, qty }], address, paymentMethod }` \u2014 prices recomputed server-side |
| GET    | /api/orders/mine  | Yes   | orders for the logged-in user                  |
| GET    | /api/orders       | Admin | all orders                                     |

## Notes

- Set a real `JWT_SECRET` (and a real `MONGO_URI`) in `backend/.env` before
  deploying anywhere public.
- Product images: the admin Add Product form can either upload a file (saved
  under `backend/uploads/`, served at `/uploads/<filename>`) or accept a
  pasted image URL / data URL. Seed products use Lorem Picsum placeholder
  photos.
- If the frontend can't reach the API, forms will surface "Couldn't reach
  the server. Is the backend running?" \u2014 check that MongoDB is running,
  that `backend`'s `npm run dev` is up, and that `VITE_API_URL` in the
  frontend's `.env` matches where it's listening.
