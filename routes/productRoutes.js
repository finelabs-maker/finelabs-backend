const express = require("express");
const {
  getAllProducts,
  getProductById,
  getProductsByFilter,
} = require("../controllers/productController");

const router = express.Router();

router.get("/allproducts", getAllProducts);
router.get("/:id", getProductById);
router.get("/", getProductsByFilter);

module.exports = router;
