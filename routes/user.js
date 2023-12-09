const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const middleware = require("../middlewares/authMiddleware");

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Protected route for testing roles
router.get("/test", middleware.verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Protected route for TESTS',
  });
});

module.exports = router;
