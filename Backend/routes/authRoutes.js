const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// GET route to test in browser
router.get("/signup", (req, res) => {
  res.send("This is signup page route working.");
});

router.get("/login", (req, res) => {
  res.send("This is login page route working.");
});

// Actual POST routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
