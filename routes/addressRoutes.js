const express = require("express");
const {
  createAddress,
  getAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-address", authenticate, createAddress);
router.get("/get-address", authenticate, getAddress);
router.delete("/delete-address/:addressId", authenticate, deleteAddress);

module.exports = router;
