const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route example
router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({ message: `Hello, ${req.user.email}` });
});

module.exports = router;