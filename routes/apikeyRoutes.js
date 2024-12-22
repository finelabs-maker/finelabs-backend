const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Define the /apikey route
router.get("/apikey/razorpay", (req, res) => {
  res.send({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
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
