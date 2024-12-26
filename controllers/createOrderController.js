const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  //key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
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
};

module.exports = { createOrder };
