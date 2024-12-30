const express = require("express");
const {
  createProfile,
  getProfile,
} = require("../controllers/profileController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-profile", authenticate, createProfile);
router.get("/get-profile", authenticate, getProfile);

module.exports = router;
