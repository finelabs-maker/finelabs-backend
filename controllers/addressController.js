const Address = require("../models/Address");

// Create a new address
exports.createAddress = async (req, res) => {
  const { userId, type, house, area, pincode, state, city } = req.body;

  // Validate required fields
  if (!userId || !type || !house || !area || !pincode || !state || !city) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  try {
    // Create a new address instance
    const newAddress = new Address({
      userId,
      type,
      house,
      area,
      pincode,
      state,
      city,
    });

    // Save the new address to the database
    await newAddress.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Address created successfully.",
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to create address.",
      error: error.message,
    });
  }
};

// Get all addresses
exports.getAddress = async (req, res) => {
  const { userId } = req.query;

  // Validate that the userId is provided
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required to fetch addresses.",
    });
  }

  try {
    // Find all addresses for the given userId
    const addresses = await Address.find({ userId });

    // Return success response, even if no addresses are found
    res.status(200).json({
      success: true,
      message:
        addresses.length > 0
          ? "Addresses fetched successfully."
          : "No addresses found for the given user.",
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to fetch addresses.",
      error: error.message,
    });
  }
};

exports.deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  // Validate that the addressId is provided
  if (!addressId) {
    return res.status(400).json({
      success: false,
      message: "Address ID is required to delete the address.",
    });
  }

  try {
    // Find and delete the address by ID
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to delete address.",
      error: error.message,
    });
  }
};
