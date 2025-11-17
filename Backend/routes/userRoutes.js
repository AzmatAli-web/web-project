// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET all users
router.get("/", userController.getUsers);

// GET single user by ID
router.get("/:id", userController.getUserById);

// DELETE user
router.delete("/:id", userController.deleteUser);

// PUT update user
router.put("/:id", userController.updateUser);

module.exports = router;
