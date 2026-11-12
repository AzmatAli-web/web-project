# Campusmarket design refresh

The React JSX marketplace now uses navy-and-cobalt styling, warm collection panels, oversized typography, a search-first homepage and a responsive editorial grid. Product cards, categories, browse pages, account panels and seller forms share the new palette. Existing API endpoints, authentication, cart operations, seller tools and admin routes are preserved.

Existing ESLint issues were resolved by separating shared category data and the cart hook from component exports, removing an unused admin approval handler, and correcting profile effect dependencies.

## Verification

- Production Vite build: passed.
- ESLint: passed with no warnings or errors.
- Frontend API/config tests: 3 passed.
- Backend HTTP/storage tests: 23 passed, with isolated database/storage adapters.
- Browser suite: 14 desktop/mobile checks added for layout, tablet width, reduced motion, search, filtering, sorting, details/contact navigation, guest redirects, and outage/retry behavior. **Browser tests could not execute**: Chromium failed at startup because its process socket could not be created (`Operation not permitted`). An alternative headless browser download also failed, and the separate preview browser could not reach the local server. No browser pass or screenshot review is claimed.
- Live database, email, payment and production deployment checks remain outstanding.

## Run locally

```sh
npm --prefix Backend ci
npm --prefix Backend test
cd campus-marketplace
npm ci
npm run build
npm run lint
npm test
npx playwright install chromium
npm run test:browser
```

Run the first two commands from the repository root. The browser suite starts Vite automatically and intercepts catalog requests with isolated fixtures. Sample listings are never bundled into production. To use an installed Chromium, set `CHROMIUM_PATH` to its executable path. Screenshots and test results are saved under the ignored `test-results` folder.
