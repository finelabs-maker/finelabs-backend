const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET Cart for a specific user with full product details and totalAmount
const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Ensure userId is provided
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Find the user's cart and populate product details for each item
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId", // Populate productId field in items array
        model: "Product", // Assuming 'Product' is the name of the product model
      })
      .exec();

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Calculate totalAmount based on the quantity and sellingPrice of each product
    let totalAmount = 0;
    let brandName = ""; // Initialize brandName

    cart.items.forEach((item) => {
      if (item.productId) {
        totalAmount += item.productId.sellingPrice * item.quantity;
        // Assuming all items in the cart have the same brandName
        if (!brandName) {
          brandName = item.productId.brandName;
        }
      }
    });

    // Calculate collectionCharges based on totalAmount and brandName
    let collectionCharges = 0; // Default value

    if (brandName === "Redcliffe Labs" && totalAmount >= 799) {
      collectionCharges = 0;
    } else if (brandName === "Redcliffe Labs" && totalAmount < 799) {
      collectionCharges = 150;
    } else {
      collectionCharges = 100;
    }

    const discount = 0;
    const platformFee = 0;

    // Final totalAmount after applying discount and adding collection charges
    const finalAmount =
      totalAmount - discount + collectionCharges + platformFee;

    return res.status(200).json({
      success: true,
      message: "Successfully fetched cart data",
      cart,
      totalAmount: `₹ ${totalAmount}`,
      discount: `₹ ${discount}`,
      collectionCharges: `₹ ${collectionCharges}`,
      platformFee: `₹ ${platformFee}`,
      finalAmount: `₹ ${finalAmount}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error, unable to fetch cart data",
    });
  }
};

// POST Add or Update Product in the Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    // Validate the input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID and quantity are required, and quantity must be at least 1",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (cart) {
      // Check if there are products in the cart with a different brand name
      const conflictingItem = cart.items.find(
        (item) => item.productId.brandName !== product.brandName
      );

      if (conflictingItem) {
        return res.status(409).json({
          success: false,
          message: `Brand mismatch: All items in the cart must belong to the same brand (${conflictingItem.productId.brandName}).`,
        });
      }

      // Check if product is already in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId._id.toString() === productId
      );

      if (itemIndex > -1) {
        // Respond that the product is already in the cart
        return res.status(409).json({
          success: false,
          message: "Product is already in the cart",
        });
      }

      // Add the new product to the cart
      cart.items.push({ productId, quantity });
    } else {
      // If no cart exists, create a new one
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    }

    // Save the cart and update the `updatedAt` field
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to the cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error, unable to add product to cart",
    });
  }
};

// DELETE Remove Product from Cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId } = req.body;

    // Validate the input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the product in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove the product from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error, unable to remove product from cart",
    });
  }
};

// DELETE Remove All Products from Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Clear the items array
    cart.items = [];

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "All items removed from cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error, unable to clear cart",
    });
  }
};

module.exports = { clearCart };

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
