// server.js or app.js
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // ✅ ADD MULTER IMPORT
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const listingRoutes = require('./routes/listingRoutes');
const connectDB = require('./config/database');
// Add this with your other route imports
const cartRoutes = require('./routes/cartRoutes');

const app = express();
connectDB();
// Simple CORS fix
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://web-project-theta-gray.vercel.app', // Remove extra "https:" and trailing slash
   
  ],
  credentials: true
}));

// Middleware with debug
app.use((req, res, next) => {
  console.log('🟡 Incoming Request:', req.method, req.url);
  console.log('🟡 Content-Type:', req.headers['content-type']);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ ADD THIS LINE FOR FORMDATA
app.use('/uploads', express.static('uploads')); // ✅ ADD STATIC FILE SERVING

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/listings', listingRoutes);


// Add this with your other app.use routes
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});