# Campusmarket

A React + Express + MongoDB marketplace for buying and selling books, gadgets, stationery, and accessories in a campus community.

The interface uses a warm off-white and forest-green design, responsive layouts, product collages, category filters, price sorting, page transitions, hover effects, loading skeletons, and reduced-motion support. Catalog, search, details, listing creation/editing, accounts, the cart, and admin screens share the same API client and layout.

## Local setup

Use Node.js 22 or newer and an accessible MongoDB database.

1. Copy `Backend/.env.example` to `Backend/.env`. Set `MONGODB_URI` and a strong `JWT_SECRET`.
2. Run `npm ci` in both `Backend` and `campus-marketplace`.
3. Run `npm run dev` in `Backend`, then `npm run dev` in `campus-marketplace`.
4. Open the frontend URL printed by Vite. Development proxies `/api` and `/uploads` to port 5000.

Do not commit `.env` files or credentials. Previously tracked environment files and hardcoded credentials were removed from the current tree. Rotate previously exposed database, JWT, and payment credentials; deleting them from the current revision does not remove them from Git history. Admin accounts now use the normal password verification flow and require a stored `admin` role; there is no automatic admin-creation shortcut.

## Vercel: frontend and API together

The repository-root `vercel.json` builds `campus-marketplace/dist` and exposes the Express app through `api/index.js`. The API module exports the application; only `Backend/server.js` starts a local listener.

- Set the Vercel project's **Root Directory to the repository root**, rather than `campus-marketplace`. Use the included install/build/output settings and Framework Preset **Other**.
- Set server environment variables `MONGODB_URI`, `JWT_SECRET`, and `FRONTEND_URL` to the frontend's actual public origin. Allow the deployment to reach MongoDB using your database's network access settings.
- Leave `VITE_API_URL` unset for this configuration. Both frontend data requests and image URLs use the same origin.
- Set `EMAIL_USER` and `EMAIL_PASSWORD` for the configured Gmail SMTP transport if verification emails are needed. Email delivery must be checked separately with your provider.
- Optional: set `STRIPE_SECRET_KEY` and `STRIPE_CURRENCY` for hosted checkout. The default currency is `pkr`, matching displayed rupee prices. Confirm that your Stripe account supports your configured currency.
- New uploads on Vercel use MongoDB GridFS (`productImages.files` / `productImages.chunks`), avoiding ephemeral disk storage. Images are limited to 4 MB. Existing tracked files under `Backend/uploads` are still served for compatibility.
- Redeploy after changing environment variables. Check `GET /api/health`: HTTP 200 with `database: "connected"` confirms readiness; HTTP 503 indicates unavailable or missing database configuration.
- Verify `/api/products` returns JSON, a direct `/product/<id>` URL loads after refresh, and newly uploaded photos remain available across deployments.

This work includes deployment configuration, but does not establish that your existing live Vercel project has these settings or that its database credentials work.

## Separate backend hosting

The frontend can also remain a static Vite deployment while Express runs on another host. Set `VITE_API_URL=https://your-backend.example.com/api` before building the frontend. The shared client resolves uploaded images against that backend origin.

Set `FRONTEND_URL` and/or comma-separated `CORS_ORIGINS` on the backend to the exact frontend origins. Bearer tokens are used; cross-origin cookies are not required. Either set `UPLOAD_STORAGE=mongodb` to use GridFS, or set `UPLOAD_DIR` to an absolute directory on a persistent disk. The server defaults to `Backend/uploads` for local development.

## API behavior

- `GET /api/products`, `/api/products/category/:category`, `/api/products/search?q=...`, `/api/products/:id` — catalog.
- `GET /api/products/user/:sellerId` and authenticated `GET /api/users/my-products` — seller listings.
- Authenticated `POST /api/products` and `PUT /api/products/:id` — JSON or multipart form fields; multipart supports an `image` field. `removeImage=true` clears a photo during edits. Edit/delete ownership is enforced on the server; admins can moderate listings.
- Authenticated `/api/cart` endpoints — cart data with consistent image URLs.
- Admin-only `GET /api/admin/stats/dashboard` — actual stored user/listing counts and category breakdowns.
- Legacy `/api/listings` paths reuse the product router. The old controller that relied on nonexistent `db.listings` arrays is no longer mounted.

Search escapes regular-expression input. Failed connections return actionable JSON errors. Invalid catalog payloads are rejected instead of being treated as arrays. Outages are displayed with a retry action, never replaced by fabricated live listings.

## Current limits

- MongoDB, SMTP delivery, GridFS against a real database, and a deployed Vercel function must be verified in the target environment. Automated tests mock database/storage adapters.
- There is no persisted payment transaction ledger, webhook confirmation, daily-activity tracking, report workflow, delivery service, or inventory reservation. Admin screens show only supported metrics. Returning from checkout does not automatically clear the cart or claim a payment is verified.
- Disk-backed uploads need a persistent disk. Existing remote uploads that were never committed or migrated will not be recovered by this change.

## Checks

```bash
npm --prefix Backend test
npm --prefix campus-marketplace test
npm --prefix campus-marketplace run build
```

The API tests run the Express application over HTTP with isolated database stubs and a temporary upload directory. They cover data/image responses, search escaping, category matching, seller routes, multipart editing, image removal, ownership, auth/admin checks, CORS, missing checkout configuration, outages, and durable image-write behavior. Frontend tests cover API URL normalization, separate-backend image URLs, and malformed responses.

Browser checks used temporary catalog fixtures to verify browsing, price sorting, category navigation, product details, seller contact, guest-cart redirects, and search. Fixtures are not included in production source.
