require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://web-project-theta-gray.vercel.app",
    ...(process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
      .split(",")
      .map((x) => x.trim().replace(/\/$/, "")),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "",
  ].filter(Boolean),
);
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.has(origin));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (process.env.UPLOAD_DIR)
  app.use("/uploads", express.static(process.env.UPLOAD_DIR));
app.get("/uploads/:filename", require("./utils/imageStorage").serveImage);
app.get("/api/health", async (req, res) => {
  try {
    await connectDB();
    res.json({ status: "ok", database: "connected" });
  } catch {
    res
      .status(503)
      .json({
        status: "unavailable",
        message: "The marketplace database is unavailable.",
      });
  }
});
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res
      .status(503)
      .json({
        message:
          "The marketplace database is unavailable. Please try again shortly.",
      });
  }
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api", (req, res) =>
  res.status(404).json({ message: "API endpoint not found" }),
);
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status =
    error.status ||
    (["LIMIT_FILE_SIZE", "LIMIT_UNEXPECTED_FILE"].includes(error.code)
      ? 400
      : error.name === "ValidationError" || error.name === "CastError"
        ? 400
        : 500);
  res
    .status(status)
    .json({
      message:
        status < 500
          ? error.message
          : "The server could not complete this request.",
    });
});
module.exports = app;
