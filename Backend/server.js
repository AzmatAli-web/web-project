// server.js or app.js
const express = require('express');
const cors = require('cors');
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

app.use(express.json());

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


