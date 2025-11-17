# Campus Marketplace - Frontend/Backend Integration Guide

## ✅ Completed Integration

### 1. Service Layer (`src/services/authService.js`)
All API functions centralized for reusability:
- **Auth**: `login(email, password)`, `signup(fullName, email, studentId, password)`
- **Products**: `submitProduct(title, description, price, category, image)`, `getAllProducts()`, `getProductById(id)`
- **Listings**: `getListings()`, `approveListing(id)`, `removeListing(id)`
- **Users**: `getUsers()`, `deleteUser(id)`, `updateUser(id, data)`

All functions:
- Store auth token in localStorage on login
- Use axios with baseURL `http://localhost:5000`
- Include proper error handling with meaningful messages

### 2. Backend Controllers & Routes

#### Auth Controller (`controllers/authController.js`)
- `POST /auth/signup` - Creates user account, returns success message
- `POST /auth/login` - Validates credentials, returns mock JWT token + user data

#### Product Controller (`controllers/productController.js`)
- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch single product
- `POST /products` - Create product (with optional image upload)
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Listing Controller (`controllers/listingController.js`)
- `GET /listings` - Fetch all listings
- `GET /listings/:id` - Fetch single listing
- `POST /listings` - Create listing
- `PUT /listings/:id` - Update/approve listing
- `DELETE /listings/:id` - Delete listing

#### Routes Registered in `server.js`
```javascript
app.use("/auth", authRoutes);       // /auth/login, /auth/signup
app.use("/users", userRoutes);      // /users (CRUD)
app.use("/products", productRoutes); // /products (CRUD)
app.use("/listings", listingRoutes); // /listings (CRUD)
```

### 3. Frontend Components

#### UI Components (No Backend Logic)
- **Login.jsx** - Pure UI with onSubmit prop (no axios/navigation)
- **Signup.jsx** - Pure UI with onSubmit prop (no axios/navigation)
- **ManageUsers.jsx** - Pure UI with onFetch/onDelete props
- **ManageListings.jsx** - Real backend calls via authService

#### Wrapper Components (Handle API + Navigation)
- **LoginPage.jsx** - Wraps Login, calls authService.login(), navigates on success
- **SignupPage.jsx** - Wraps Signup, calls authService.signup(), navigates on success

#### Updated Components
- **ManageListings.jsx** - Uses authService to fetch/approve/remove listings
- Has Zod validation for data integrity
- Loading/error states handled
- Shows confirmation dialogs before delete

### 4. Data Flow Example: Login

```
User Input (LoginPage.jsx)
    ↓
Form Validation (Zod in Login.jsx)
    ↓
onSubmit Handler (LoginPage.jsx)
    ↓
authService.login() - axios POST to /auth/login
    ↓
Backend: authController.login() - returns token
    ↓
Store token in localStorage
    ↓
Navigate to home "/"
```

### 5. How to Use Each Component

#### Using Login/Signup
Update your routing to use the wrapper pages:
```javascript
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";

// In your router:
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
```

#### Using ManageListings
```javascript
import ManageListings from "./AdminSect/ManageListings";

// Component handles all API calls automatically
<Route path="/admin/listings" element={<ManageListings />} />
```

#### Using ManageUsers
```javascript
import ManageUsers from "./AdminSect/ManageUsers";

// Pass API handlers as props
const handleFetch = async () => {
  const response = await authService.getUsers();
  return response.data;
};

const handleDelete = async (id) => {
  await authService.deleteUser(id);
};

<ManageUsers onFetch={handleFetch} onDelete={handleDelete} />
```

### 6. Backend Startup
```bash
cd Backend
npm install  # if needed
npm run dev  # or npm start
```

Server runs on `http://localhost:5000` with all endpoints active.

### 7. Frontend Configuration
The axios client is already configured in `src/api/axiosClient.js`:
```javascript
baseURL: "http://localhost:5000"
headers: { "Content-Type": "application/json" }
```

### 8. Token Management
- Tokens stored in `localStorage` with key `authToken`
- Can retrieve with: `localStorage.getItem("authToken")`
- Can clear with: `localStorage.removeItem("authToken")`

### 9. Next Steps (Optional Enhancements)
1. Add JWT verification on backend
2. Create auth middleware to protect routes
3. Add image file upload with multer
4. Connect to real database (MongoDB)
5. Add password hashing (bcrypt)
6. Create context/state management for auth state
7. Add loading spinners during API calls

---

## Testing Checklist

- [ ] Start backend: `npm run dev` in Backend folder
- [ ] Start frontend: `npm run dev` in campus-marketplace folder
- [ ] Test Login: Enter email/password, should redirect to home
- [ ] Test Signup: Fill form, should redirect to login
- [ ] Test ManageListings: Should fetch and display listings from backend
- [ ] Test Approve: Click approve, status should update
- [ ] Test Delete: Click delete, listing should be removed
- [ ] Check localStorage for auth token after login

---

**All components are now fully integrated with the backend!** ✨
