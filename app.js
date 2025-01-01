require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Connect to the database
connectDB();

// Import routes
const authRoutes = require("./routes/authRoutes");
const apiKeyRoutes = require("./routes/apikeyRoutes");
const profileRoutes = require("./routes/profileRoutes");
const memberRoutes = require("./routes/memberRoutes");
const addressRoutes = require("./routes/addressRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Access environment variables
const port = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json());

// Use cors middleware
app.use(cors()); // Enables CORS for all routes

app.use("/auth", authRoutes);
app.use("/api", apiKeyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
