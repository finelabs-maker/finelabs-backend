const Profile = require("../models/Profile");

// Save profile data
exports.createProfile = async (req, res) => {
  const { userId, name, dob, contact, email, gender } = req.body;

  try {
    const newProfile = new Profile({
      userId,
      name,
      dob,
      contact,
      email,
      gender,
    });

    // Save the profile to the database
    const savedProfile = await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: savedProfile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);

    // Handle duplicate email or userId error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or userId already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get profile data
exports.getProfile = async (req, res) => {
  const { userId } = req.query;

  try {
    // Fetch the profile based on userId
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
