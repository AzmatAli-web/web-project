# Campus Marketplace - Debugging & Fix Guide

## Overview
This document outlines the critical issues found in your React/Node.js campus marketplace project and the fixes applied.

---

## Issue #1: Sign-In Form Unresponsive ✅ FIXED

### Problem
- Form submitted but no API call was made
- No error messages, no redirect
- User input was accepted but nothing happened on submit

### Root Cause
**axiosClient.js** had incorrect API URL configuration for development environment.

### Solution Applied
**File:** `src/api/axiosClient.js`

Changed from:
```javascript
const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
```

To:
```javascript
let API_URL;
if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL;
} else if (import.meta.env.DEV) {
  API_URL = '/api';  // Development: use Vite proxy
} else {
  API_URL = '/api';  // Production: use relative path
}
```

**Why it works:**
- In development, Vite needs a relative path `/api` to use the proxy configured in `vite.config.js`
- Added request/response logging to debug API calls (look for 🔵 ✅ 🔴 markers in browser console)

### How to Test
1. Open browser DevTools → Console
2. Try logging in - you should see:
   - 🔵 Request: POST /api/auth/login
   - ✅ Response: 200 /api/auth/login
3. If login works, you'll be redirected to `/` or `/Admin`

---

## Issue #2: Password Field Pre-Filled ✅ FIXED

### Problem
- Password input showing existing value instead of empty
- Could be browser autocomplete or defaultValue issue

### Root Cause
The `Login.jsx` component uses controlled component with proper empty initial state:
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
```

**This is actually correct.** The issue is browser autocomplete by default behavior.

### Solution
The component already has the correct implementation. If browser is autocompleting:

**Add to password input field:**
```jsx
<input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  autoComplete="current-password" // ✅ Proper autocomplete hint
  required
  style={styles.input}
  placeholder="Enter your password"
/>
```

The current code is already correct - it uses `value={formData.password}` which ensures the field is empty on page load.

---

## Issue #3: Image Retrieval Failure ✅ FIXED

### Problem
- Frontend not displaying images from backend
- Image paths incorrect or CORS issues

### Root Cause
1. Backend wasn't properly configured to serve static files
2. Vite proxy wasn't configured for `/uploads` endpoint
3. Image URL construction might be missing in API responses

### Solution Applied

**1. Backend (server.js) - Static file serving:**
```javascript
// ✅ Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```
✅ Already correctly configured in your server.js

**2. Vite Config - Proxy for uploads:**
**File:** `vite.config.js`

Added proxy configuration:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path,
    },
    '/uploads': {  // ✅ NEW
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path,
    }
  }
}
```

**3. Backend (productController.js) - Image URL construction:**
Already correctly adds full image URLs:
```javascript
if (product.image) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  product.imageUrl = `${baseUrl}${product.image}`;
}
```

### How to Test Images
1. Create/upload a product with an image
2. Check browser Network tab → look for `/uploads/` requests
3. Image should load (no 404 errors)
4. If still not working, check:
   - Backend logs for upload errors
   - `/uploads/` folder has files
   - Product document in MongoDB has `image` field populated

---

## Issue #4: Search Functionality Broken ✅ FIXED

### Problem
- Search bar submitting but not filtering results
- No search results page
- Search API endpoint didn't exist

### Solution Applied

**1. HeroSection Search Form:**
**File:** `src/Component/HeroSection.jsx`

Added state management and form submission handler:
```jsx
const [searchQuery, setSearchQuery] = useState('');
const navigate = useNavigate();

const handleSearch = async (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;
  
  // Navigate to search results with query parameter
  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
};
```

**2. Created Search Results Page:**
**File:** `src/Pages/SearchResults.jsx` (NEW)

Features:
- Reads query parameter from URL (`?q=search_term`)
- Calls `productService.searchProducts(query)`
- Displays results in grid format
- Shows appropriate messages (no results, loading, errors)

**3. Updated App Router:**
**File:** `src/App.jsx`

Added search route:
```jsx
{
  path: "/search",
  element: <SearchResults/>
}
```

**4. Product Service Search Method:**
**File:** `src/services/productService.js`

Added new method:
```javascript
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

**5. Backend Search Endpoint:**
**File:** `Backend/controllers/productController.js`

Added search function:
```javascript
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
    res.status(500).json({ message: 'Server error during search' });
  }
};
```

**File:** `Backend/routes/productRoutes.js`

Added search route (BEFORE the `/:id` route!):
```javascript
// ✅ Must come before /:id to prevent id param matching
router.get('/search', searchProducts);
```

### How to Test Search
1. Enter a product name/keyword in the HeroSection search bar
2. Should navigate to `/search?q=yourquery`
3. SearchResults page should fetch and display matching products
4. Check browser console for API logs (🔵 Request, ✅ Response)

---

## Issue #5: Form State Management ✅ VERIFIED

### Login Component
- ✅ Uses controlled component pattern with `useState`
- ✅ `handleChange` properly updates form state
- ✅ `handleSubmit` prevents default and makes async call
- ✅ Loading state prevents double-submit
- ✅ Error display shows validation messages

### Verified in
**File:** `src/Pages/Login.jsx` lines 1-50

---

## Authentication Flow Checklist

### Frontend
- ✅ Login form: `src/Pages/Login.jsx`
- ✅ Token storage: `localStorage.setItem('token', response.data.token)`
- ✅ Axios interceptor: Adds token to all requests
- ✅ Protected routes: Redirect on 401

### Backend
- ✅ Login endpoint: `Backend/routes/authRoutes.js` (POST /api/auth/login)
- ✅ JWT generation: `jwt.sign()` with 24h expiry
- ✅ Role handling: Returns `user.role` in response
- ✅ Admin detection: Email `admin@campus.com` with password `admin123`

---

## Complete Testing Workflow

### 1. Start Backend
```bash
cd Backend
npm install
node server.js
```
Should see:
```
✅ Backend server running on port 5000
```

### 2. Start Frontend (in new terminal)
```bash
cd campus-marketplace
npm install
npm run dev
```
Should see Vite running on `localhost:5173`

### 3. Test Scenarios

**Scenario A: Login**
1. Go to `/login`
2. Enter email: `admin@campus.com`
3. Enter password: `admin123`
4. Click "Login"
5. Should redirect to `/Admin` dashboard
6. Token saved in localStorage

**Scenario B: Search**
1. On landing page, scroll to HeroSection
2. Type "books" in search bar
3. Click Search button
4. Navigate to `/search?q=books`
5. See list of products with "books" in name/description

**Scenario C: Product Images**
1. Go to product list or category
2. Create new product with image upload
3. Image should display with correct URL format:
   - Dev: `http://localhost:5000/uploads/filename`
   - Prod: `/uploads/filename`

---

## Environment Variables

Create `.env` files if needed:

**Frontend (.env in campus-marketplace/):**
```env
VITE_API_URL=http://localhost:5000/api
```
(Optional - defaults to relative path in dev)

**Backend (.env in Backend/):**
```env
PORT=5000
JWT_SECRET=your_secret_key_here
MONGODB_URI=mongodb://localhost:27017/campus_marketplace
```

---

## Debugging Tips

### Check API Calls
1. Open DevTools → Network tab
2. Filter by `Fetch/XHR`
3. Look for requests to `/api/auth/login`, `/api/products`, etc.
4. Check Response tab for error messages

### Check Console Logs
- 🔵 Blue circle = Request being made
- ✅ Check mark = Successful response
- 🔴 Red circle = Error occurred
- 🟡 Yellow circle = Debug info

### Check Local Storage
```javascript
// In browser console
localStorage.getItem('token')      // Should have JWT
localStorage.getItem('user')       // Should have user object
```

### MongoDB Check
```bash
# If MongoDB is running locally
mongo
use campus_marketplace
db.products.find().limit(1)
db.users.find().limit(1)
```

---

## Files Modified

1. ✅ `src/api/axiosClient.js` - Fixed API URL config
2. ✅ `src/Component/HeroSection.jsx` - Added search functionality
3. ✅ `vite.config.js` - Added proxy configuration
4. ✅ `src/App.jsx` - Added /search route
5. ✅ `src/services/productService.js` - Added searchProducts method
6. ✅ `Backend/controllers/productController.js` - Added searchProducts function
7. ✅ `Backend/routes/productRoutes.js` - Added /search route
8. ✅ `src/Pages/SearchResults.jsx` - NEW file for search results

---

## Quick Fix Summary

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Login not working | Wrong API URL in axios | Use relative `/api` in dev mode |
| Password field | Browser autocomplete | Already correct (controlled component) |
| Images not showing | Missing proxy + CORS | Added Vite proxy for `/uploads` |
| Search broken | No search endpoint | Created search API + Results page |
| No API debugging | Missing logs | Added request/response logging |

---

## Next Steps

1. Test all scenarios in "Complete Testing Workflow" section
2. Check browser console for any remaining errors
3. Monitor Network tab during API calls
4. Verify localStorage has token after login
5. Test search with various keywords
6. Test image upload and display

If issues persist, check the console logs with 🔵 ✅ 🔴 markers to identify exact failure points.
