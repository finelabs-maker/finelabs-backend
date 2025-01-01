const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/get-cart/:userId", authenticate, getCart);
router.post("/add-cart/:userId", authenticate, addToCart);
router.delete("/remove-cart/:userId", authenticate, removeFromCart);
router.delete("/clear-cart/:userId", clearCart);

module.exports = router;
