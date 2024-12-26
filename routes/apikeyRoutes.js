const express = require("express");
const router = express.Router();

const { sendOTP, verifyOTP } = require("../controllers/otpController");
const { createOrder } = require("../controllers/createOrderController");
const { sendEmail } = require("../controllers/emailController");

// Route to send OTP
router.post("/send-otp", sendOTP);

// Route to verify OTP
router.post("/verify-otp", verifyOTP);

// Define the /payment endpoint
router.post("/create-order", createOrder);

// Define the /send-email endpoint
router.post("/send-email", sendEmail);

module.exports = router;
