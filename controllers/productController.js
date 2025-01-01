const Product = require("../models/Product");

// Get All Products with Pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 9; // Number of products per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Get the total count of products
    const totalProducts = await Product.countDocuments();

    // Fetch the products with pagination
    const products = await Product.find().skip(skip).limit(limit);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Get Products by Filter with Pagination
exports.getProductsByFilter = async (req, res) => {
  const { filterByBodyPart, productCategory, productType, page } = req.query;
  const pageNum = parseInt(page) || 1; // Default to page 1 if not provided
  const limit = 9; // Number of products per page
  const skip = (pageNum - 1) * limit; // Calculate the number of documents to skip

  // Build filter object based on query params
  const filters = {};
  if (filterByBodyPart) filters.filterByBodyPart = filterByBodyPart;
  if (productCategory) filters.productCategory = productCategory;
  if (productType) filters.productType = productType;

  try {
    // Get the total count of products matching the filters
    const totalProducts = await Product.countDocuments(filters);

    // Fetch the products with filters and pagination
    const products = await Product.find(filters).skip(skip).limit(limit);

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found matching the filters",
      });
    }

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
