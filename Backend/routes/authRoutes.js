const router = require("express").Router();
const {
  register,
  login,
  verify,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/authController");
const auth = require("../middleware/auth");
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/verify", auth, verify);
module.exports = router;
