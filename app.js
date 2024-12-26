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

// Access environment variables
const port = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json());

// Use cors middleware
app.use(cors()); // Enables CORS for all routes

app.use("/auth", authRoutes);
app.use("/api", apiKeyRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
