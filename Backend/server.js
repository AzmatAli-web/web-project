// server.js or app.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const listingRoutes = require('./routes/listingRoutes');
const connectDB = require('./config/database');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
connectDB();

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Simple CORS fix
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://web-project-theta-gray.vercel.app',
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
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});