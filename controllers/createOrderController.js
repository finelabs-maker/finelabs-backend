const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order API
const createOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount, // amount in the smallest currency unit (e.g., paise for INR)
      currency: currency || "INR",
      receipt: receipt || "receipt#1",
      payment_capture: 1,
    };

    const createOrderData = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      createOrderData,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating payment",
      error,
    });
  }
};

module.exports = { createOrder };
