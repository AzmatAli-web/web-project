// middleware/adminAuth.js
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin privileges required",
        yourRole: user.role,
      });
    }

    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminAuth;
