require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Import routes
const apiKeyRoutes = require("./routes/apikeyRoutes");

// Access environment variables
const port = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json());

// Use cors middleware
app.use(cors()); // Enables CORS for all routes

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api", apiKeyRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
