const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Path to the uploads directory
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, "../uploads");

// Create uploads directory if it doesn't exist
if (
  !process.env.VERCEL &&
  process.env.UPLOAD_STORAGE !== "mongodb" &&
  !fs.existsSync(uploadsDir)
) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage:
    process.env.VERCEL || process.env.UPLOAD_STORAGE === "mongodb"
      ? multer.memoryStorage()
      : storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        Object.assign(new Error("Only images are allowed"), { status: 400 }),
        false,
      );
    }
  },
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB leaves room for multipart fields within the function request limit.
});

module.exports = upload;
