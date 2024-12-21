const express = require("express");
const router = express.Router();

// Define the /apikey route
router.get("/apikey/razorpay", (req, res) => {
  res.send({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
});

module.exports = router;
