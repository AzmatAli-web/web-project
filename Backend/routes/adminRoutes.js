const router = require("express").Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/user");
const Product = require("../models/product");
router.use(auth, adminAuth);
router.get("/stats/dashboard", async (req, res, next) => {
  try {
    const [
      totalUsers,
      approvedUsers,
      verifiedUsers,
      totalProducts,
      categories,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "approved" }),
      User.countDocuments({ isVerified: true }),
      Product.countDocuments(),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);
    res.json({
      totalUsers,
      approvedUsers,
      verifiedUsers,
      totalProducts,
      categories,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
