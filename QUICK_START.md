# Quick Start & Testing Guide

## 🚀 Start the Application

### Terminal 1: Backend
```bash
cd /home/azmat/Desktop/webproject/web-project/Backend
npm install  # Only first time
node server.js
```
Expected output:
```
✅ Backend server running on port 5000
```

### Terminal 2: Frontend
```bash
cd /home/azmat/Desktop/webproject/web-project/campus-marketplace
npm install  # Only first time
npm run dev
```
Expected output:
```
  VITE v7.1.6  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## ✅ Test Checklist

### Test 1: Login (Sign-In Form)
- [ ] Navigate to `http://localhost:5173/login`
- [ ] Email: `admin@campus.com`
- [ ] Password: `admin123`
- [ ] Click "Login"
- [ ] **Expected:** Redirected to `/Admin` dashboard
- [ ] **Check:** Open DevTools Console → look for `🔵 Request: POST /api/auth/login`
- [ ] **Check:** localStorage should have `token` and `user`

**Command to verify in console:**
```javascript
localStorage.getItem('token')  // Should show JWT token
localStorage.getItem('user')   // Should show user object
```

---

### Test 2: Search Functionality
- [ ] Go to `http://localhost:5173/` (landing page)
- [ ] In HeroSection, type `books` in search bar
- [ ] Click "Search" button
- [ ] **Expected:** Navigate to `/search?q=books`
- [ ] **Expected:** Show products with "books" in name/description
- [ ] **Check:** DevTools Network tab → see `/api/products/search?q=books` request
- [ ] **Status:** Response should be 200 with array of products

---

### Test 3: Product Images
- [ ] Go to `/sell` page
- [ ] Create new product with image upload
- [ ] Submit form
- [ ] **Expected:** See "Product created successfully"
- [ ] Go to product detail page or listing
- [ ] **Expected:** Image displays correctly
- [ ] **Check:** Right-click image → "Open Image in New Tab"
- [ ] Image URL should be: `http://localhost:5000/uploads/[filename]`

---

### Test 4: Category Browsing
- [ ] Go to landing page
- [ ] Click on a category (e.g., "Books")
- [ ] **Expected:** Navigate to `/category/books`
- [ ] **Expected:** See products in that category
- [ ] **Check:** Images load correctly

---

### Test 5: Password Field
- [ ] Go to `/login`
- [ ] Focus on password field
- [ ] **Expected:** Field is empty (no pre-filled text)
- [ ] Type a password
- [ ] **Expected:** Input hides with dots (•••)
- [ ] Form submits correctly with password

---

## 🔍 Debugging Commands

### Check Backend Logs
Terminal shows live request logs:
```
🟡 Incoming Request: POST /api/auth/login
🟡 Product Route Hit: GET /api/products
```

### Check Frontend Logs
DevTools Console → Filter by blue/green emoji:
```
🔵 API_URL configured as: /api
🔵 Request: POST /api/auth/login
✅ Response: 200 /api/auth/login
```

### Check MongoDB Data
```bash
# Terminal 3
mongo
use campus_marketplace
db.users.findOne({email: "admin@campus.com"})
db.products.find().limit(3)
```

### Test Axios Client
Console snippet:
```javascript
import axiosClient from './src/api/axiosClient'

// Test API call
axiosClient.get('/products').then(r => console.log(r.data))
```

---

## 📁 Key Files Changed

| File | Change | Purpose |
|------|--------|---------|
| `src/api/axiosClient.js` | Fixed API URL config | ✅ Login API calls work |
| `src/Component/HeroSection.jsx` | Added search state & handler | ✅ Search form submits |
| `vite.config.js` | Added proxy config | ✅ `/uploads` requests work |
| `src/Pages/SearchResults.jsx` | NEW file | ✅ Display search results |
| `src/App.jsx` | Added `/search` route | ✅ Route to results page |
| `src/services/productService.js` | Added `searchProducts()` | ✅ Call search API |
| `Backend/controllers/productController.js` | Added `searchProducts()` | ✅ Search endpoint logic |
| `Backend/routes/productRoutes.js` | Added `/search` route | ✅ Register search route |

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot POST /api/auth/login"
**Fix:** Make sure backend is running on port 5000
```bash
ps aux | grep node  # Check if server running
```

### Issue: Images not loading (404)
**Fix:** Make sure `/uploads` folder has files
```bash
ls -la Backend/uploads/
```

### Issue: CORS error in console
**Fix:** Already configured in backend `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', ...],
  credentials: true
}));
```

### Issue: "API_URL undefined" in console
**Fix:** Already configured. Check if Vite proxy is working:
1. Network tab → type `/api`
2. Should show requests proxied to `localhost:5000`

### Issue: Search returns empty results
**Fix:** 
1. Check products exist: `db.products.find()` in MongoDB
2. Check query syntax in Network tab
3. Look at backend logs for errors

---

## 📊 Expected API Responses

### Login Success
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "email": "admin@campus.com",
    "role": "admin"
  }
}
```

### Search Results
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Python Book",
    "price": 500,
    "description": "Learn Python programming",
    "category": "books",
    "imageUrl": "http://localhost:5000/uploads/img123.jpg",
    "seller": {
      "name": "John",
      "email": "john@example.com"
    }
  },
  ...
]
```

### Product by Category
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Notebook",
    "price": 50,
    "category": "stationery",
    "imageUrl": "http://localhost:5000/uploads/notebook.jpg",
    ...
  }
]
```

---

## 📱 Browser DevTools Setup

### Recommended Tabs
1. **Console** - Watch for 🔵 ✅ 🔴 logs
2. **Network** - Monitor API requests
3. **Storage** - Check localStorage (token, user)
4. **Application** - View localStorage in table format

### Quick Commands
```javascript
// See all API calls
console.table(JSON.parse(localStorage.getItem('user')))

// Test axios
import axiosClient from './src/api/axiosClient'
axiosClient.get('/products').then(r => console.log('Products:', r.data))

// Check token expiry
const token = localStorage.getItem('token')
const decoded = JSON.parse(atob(token.split('.')[1]))
console.log('Token expires at:', new Date(decoded.exp * 1000))
```

---

## ⚡ Performance Tips

1. **First load slow?** 
   - Vite is compiling - wait 5 seconds
   - Hard refresh: `Ctrl+Shift+R`

2. **API calls stuck?**
   - Check Network tab → pending requests
   - Backend might be restarting
   - Restart `node server.js`

3. **Hot Reload not working?**
   - Make sure you're editing `.jsx` or `.js` files
   - CSS changes auto-reload in Vite
   - Hard refresh if nothing changes

---

## 📝 Testing Notes

**Test Time:** ~5 minutes
**Success Rate Target:** All 5 tests passing
**Common Issues:** Image paths, backend not running

Save this guide in your VS Code favorites for quick reference!
