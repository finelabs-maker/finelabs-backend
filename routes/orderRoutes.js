const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-order", authenticate, createOrder);
router.get("/get-order", authenticate, getOrders);

module.exports = router;
