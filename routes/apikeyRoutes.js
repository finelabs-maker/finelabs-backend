const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const sgMail = require("@sendgrid/mail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Define the /payment endpoint
router.post("/payment", async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    // Create an order with Razorpay
    const options = {
      amount: amount,
      currency: currency || "INR",
      receipt: receipt || "receipt#1",
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment",
      error,
    });
  }
});

// Email Sending Endpoint
router.post("/send-email", (req, res) => {
  const { to, subject, text, html } = req.body;

  // Validate request body
  if (!to || !subject || (!text && !html)) {
    return res.status(400).send("Invalid request: Missing required fields.");
  }

  const msg = {
    to,
    from: "order@finelabs.in",
    subject,
    text,
    html,
  };

  sgMail
    .send(msg)
    .then(() => res.status(200).send("Email sent successfully!"))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error sending email");
    });
});

module.exports = router;
