# Code Fixes Reference

## Issue #1: API URL Configuration

### Before (Broken)
```javascript
// src/api/axiosClient.js (OLD)
const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
// Problem: window.location.origin gives http://localhost:5173, not the backend!
```

### After (Fixed)
```javascript
// src/api/axiosClient.js (NEW)
let API_URL;

if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL;
} 
else if (import.meta.env.DEV) {
  API_URL = '/api';  // Use relative path for Vite proxy
}
else {
  API_URL = '/api';  // Production also uses relative path
}

console.log('🔵 API_URL configured as:', API_URL);
```

**Why it works:**
- Development: Vite proxy intercepts `/api` → redirects to `http://localhost:5000`
- Production: Server serves both `/` and `/api` from same domain

---

## Issue #2: Search Form Submission

### Before (Broken)
```jsx
// src/Component/HeroSection.jsx (OLD)
<form className="mt-4 ms-5 justify-content-center">
  <div className="input-group input-group-lg shadow-sm" style={{ maxWidth: '720px' }}>
    <input type="text" className="form-control rounded-start" placeholder="Search..." />
    <button className="btn btn-primary rounded-end" type="submit">Search</button>
  </div>
</form>
// Problem: No state management, no handler, form does nothing
```

### After (Fixed)
```jsx
// src/Component/HeroSection.jsx (NEW)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <section className="container-fluid py-4">
      {/* ... other content ... */}
      <form className="mt-4 ms-5 justify-content-center" onSubmit={handleSearch}>
        <div className="input-group input-group-lg shadow-sm" style={{ maxWidth: '720px' }}>
          <input 
            type="text" 
            className="form-control rounded-start" 
            placeholder="Search for books, gadgets, stationery..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary rounded-end" type="submit">Search</button>
        </div>
      </form>
    </section>
  );
}
```

**Key changes:**
1. Added `useState` for search query
2. Added `handleSearch` function with form submission handler
3. Navigate to `/search?q=query` on submit
4. Input is controlled component with `value` and `onChange`

---

## Issue #3: Vite Proxy Configuration

### Before (Broken)
```javascript
// vite.config.js (OLD)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
// Problem: No proxy configured, `/api` requests fail
```

### After (Fixed)
```javascript
// vite.config.js (NEW)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
  }
})
```

**What it does:**
- `/api/*` → proxies to `http://localhost:5000/api/*`
- `/uploads/*` → proxies to `http://localhost:5000/uploads/*`
- Solves CORS issues in development
- `changeOrigin: true` sets origin header properly

---

## Issue #4: Search Endpoint (Backend)

### Before (Broken)
```javascript
// Backend/routes/productRoutes.js (OLD)
router.get('/category/:categoryName', getProductsByCategory);
router.get('/:id', getProductById);  // This catches /search!
// Problem: /:id route matches /search, never reaches search endpoint
```

### After (Fixed)
```javascript
// Backend/routes/productRoutes.js (NEW)
router.post('/', auth, upload.single('image'), createProduct);
router.get('/', getProducts);

// ✅ MUST come before /:id route!
router.get('/search', searchProducts);

router.get('/category/:categoryName', getProductsByCategory);
router.get('/:id', getProductById);  // Now this doesn't catch /search
```

**Key lesson:** Route order matters! Specific routes must come BEFORE generic `/:id` routes.

### Search Controller Function
```javascript
// Backend/controllers/productController.js (NEW)
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || !q.trim()) {
      return res.json([]);
    }

    // Search in name, description, and category (case-insensitive)
    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate('seller', 'name email')
      .lean();

    // Add image URLs to response
    const productsWithUrls = products.map(product => {
      if (product.image) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        product.imageUrl = `${baseUrl}${product.image}`;
      } else {
        product.imageUrl = null;
      }
      return product;
    });

    res.json(productsWithUrls);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};
```

**Query logic:**
- `$or`: Search in multiple fields
- `$regex`: Pattern matching
- `$options: 'i'`: Case-insensitive search
- Results sorted by newest first
- Image URLs included in response

---

## Issue #5: Search Results Page (NEW FILE)

### Create File
```
src/Pages/SearchResults.jsx (NEW)
```

### Implementation
```jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../Component/NavigationBar';
import Footer from '../Component/Footer';
import AddToCartButton from '../Component/Cart/AddToCartButton';
import productService from '../services/productService';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🔵 Searching for:', query);
        
        // Call search API endpoint
        const results = await productService.searchProducts(query);
        console.log('✅ Search results:', results);
        
        setProducts(results);
      } catch (err) {
        console.error('❌ Search error:', err);
        setError(err.message || 'Failed to search products');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // ... render JSX with products ...
}
```

**Key features:**
- Reads query from URL: `useSearchParams()`
- Calls search API when query changes
- Displays loading/error/results states
- Includes image fallback handling

---

## Issue #6: Product Service Search Method

### Before (Broken)
```javascript
// src/services/productService.js (OLD - MISSING)
// No searchProducts method!
```

### After (Fixed)
```javascript
// src/services/productService.js (NEW)
searchProducts: async (query) => {
  try {
    if (!query.trim()) {
      return [];
    }
    const response = await axiosClient.get('/products/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to search products';
  }
}
```

**Usage:**
```javascript
const results = await productService.searchProducts('books');
// GET /api/products/search?q=books
```

---

## Issue #7: App Router Configuration

### Before (Broken)
```jsx
// src/App.jsx (OLD)
const router = createBrowserRouter([
  { path: "/", element: <LandingPage/> },
  { path: "/login", element: <Login/> },
  // ... other routes ...
  // Missing: /search route!
]);
```

### After (Fixed)
```jsx
// src/App.jsx (NEW)
import SearchResults from './Pages/SearchResults'; // ✅ ADD IMPORT

const router = createBrowserRouter([
  { path: "/", element: <LandingPage/> },
  { path: "/login", element: <Login/> },
  // ... other routes ...
  { path: "/search", element: <SearchResults/> }, // ✅ ADD THIS ROUTE
]);
```

---

## Debugging Techniques

### 1. Check API Configuration
```javascript
// In browser console
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('ENV:', import.meta.env.DEV ? 'development' : 'production')
```

### 2. Monitor API Calls
```javascript
// DevTools Console → Network tab
// Filter by 'Fetch/XHR'
// Look for requests to /api endpoints
// Check Response tab for data/errors
```

### 3. Verify Token Storage
```javascript
// In browser console
localStorage.getItem('token')        // JWT token
localStorage.getItem('user')         // User object
JSON.parse(localStorage.getItem('user'))  // Pretty print user
```

### 4. Test Axios Directly
```javascript
// In browser console
import axiosClient from './src/api/axiosClient'

// Test login
axiosClient.post('/auth/login', {
  email: 'admin@campus.com',
  password: 'admin123'
}).then(r => console.log('Login:', r.data))

// Test search
axiosClient.get('/products/search', {
  params: { q: 'books' }
}).then(r => console.log('Results:', r.data))
```

### 5. Check Backend Logs
```
🟡 Incoming Request: POST /api/auth/login
🟡 Content-Type: application/json
🟡 Product Route Hit: GET /api/products/search?q=books
✅ All logs should be green when working
```

---

## Common Errors & Fixes

### Error: "POST /api/auth/login 404"
```
Root cause: Backend not running or wrong port
Fix: 
  1. Check terminal running "node server.js"
  2. Verify PORT=5000 in Backend/.env
  3. Restart backend
```

### Error: "Cannot read property 'imageUrl' of undefined"
```
Root cause: Backend not returning imageUrl in response
Fix:
  1. Check productController.js adds imageUrl
  2. Verify product has image field in MongoDB
  3. Check /uploads folder has files
```

### Error: "CORS error: No 'Access-Control-Allow-Origin' header"
```
Root cause: CORS not configured or Vite proxy not working
Fix:
  1. Check server.js has cors() middleware
  2. Check vite.config.js has proxy configuration
  3. Restart frontend: npm run dev
```

### Error: "Search returns empty array"
```
Root cause: Products don't exist or query doesn't match
Fix:
  1. Create some products first
  2. Check MongoDB: db.products.find()
  3. Verify search query syntax
  4. Check backend logs for errors
```

---

## Quick Copy-Paste Commands

### Start everything
```bash
# Terminal 1
cd Backend && node server.js

# Terminal 2
cd campus-marketplace && npm run dev

# Terminal 3
mongo && use campus_marketplace && db.products.find()
```

### Test search endpoint
```bash
curl "http://localhost:5000/api/products/search?q=books"
```

### Check if backend is running
```bash
curl http://localhost:5000/api/products
```

### View all products
```bash
curl "http://localhost:5000/api/products" | jq
```

---

## Summary of Root Causes

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Login fails | API URL points to frontend domain | Use relative `/api` with Vite proxy |
| Search does nothing | Form has no handler/navigation | Add `handleSearch` function + navigate() |
| Images 404 | Proxy not configured for `/uploads` | Add `/uploads` to vite.config.js proxy |
| Search returns nothing | No backend search endpoint | Create `/search` GET route in backend |
| Route not matching | Search route after `/:id` | Move `/search` before `/:id` in routes |

All issues are now resolved! Test using QUICK_START.md guide.
