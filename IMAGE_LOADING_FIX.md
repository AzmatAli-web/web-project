# Image Loading Fix for Railway Deployment

## Problem
Images were not loading in production on Railway because the code was hardcoded to use `http://localhost:5000` which only works when the backend is running locally.

## Solution
Updated the code to use dynamic URLs that work in both local development and production:

### Changes Made

#### 1. **axiosClient.js** - API Base URL Configuration
```javascript
// BEFORE (hardcoded):
baseURL: 'http://localhost:5000/api'

// AFTER (dynamic):
const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
baseURL: API_URL
```

**How it works:**
- Checks for `VITE_API_URL` environment variable (for custom API URLs)
- Falls back to `window.location.origin/api` (current domain + /api)
  - Local: `http://localhost:5173/api`
  - Production: `https://your-domain.up.railway.app/api`

#### 2. **ManageListings.jsx** - Image URL Generation
```javascript
// BEFORE (hardcoded):
return `http://localhost:5000/${normalizedPath}`;

// AFTER (dynamic):
return `${window.location.origin}/${normalizedPath}`;
```

### Deployment Instructions

#### For Railway:

1. **Backend Configuration**
   - Your Railway backend serves both API and uploaded files
   - Make sure the backend is accessible at your Railway domain

2. **Frontend Environment Variable (Optional)**
   - If your API is on a different domain, set in Railway:
     ```
     VITE_API_URL=https://your-backend-domain.up.railway.app/api
     ```
   - If API is on same domain (recommended), no configuration needed

3. **How It Works**
   - All images and API calls automatically use the current domain
   - If frontend is at `https://app.up.railway.app`
   - Images load from `https://app.up.railway.app/uploads/...`
   - API calls go to `https://app.up.railway.app/api/...`

### Testing

**Local Development:**
```bash
npm run dev
# Images load from: http://localhost:5173/uploads/...
# API calls to: http://localhost:5173/api/... (proxied to backend)
```

**Production on Railway:**
```
Images load from: https://your-domain.up.railway.app/uploads/...
API calls to: https://your-domain.up.railway.app/api/...
```

### Troubleshooting

If images still don't load:
1. Check browser console for the actual image URL being requested
2. Verify uploads folder exists on backend: `Backend/uploads/`
3. Check backend logs for file serving errors
4. Ensure backend file upload middleware is configured correctly
