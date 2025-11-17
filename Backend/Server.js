// server.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Security Headers
app.use((req, res, next) => {
  res.header("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:* ws: wss:;");
  next();
});

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const listingRoutes = require("./routes/listingRoutes");

// Use Routes
app.use("/auth", authRoutes);       // signup + login
app.use("/users", userRoutes);      // manage users
app.use("/products", productRoutes); // product management
app.use("/listings", listingRoutes); // listing management

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
