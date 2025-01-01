const Member = require("../models/Member");

// Create a new member
exports.createMember = async (req, res) => {
  const { userId, name, contact, dob, gender, relationship } = req.body;

  // Validation (ensure all required fields are provided)
  if (!userId || !name || !contact || !dob || !gender || !relationship) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  try {
    // Create a new Member
    const newMember = new Member({
      userId,
      name,
      contact,
      dob,
      gender,
      relationship,
    });

    // Save the member to the database
    await newMember.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Member created successfully.",
    });
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to create member.",
      error: error.message,
    });
  }
};

// Get all members' data by userId
exports.getMembers = async (req, res) => {
  const { userId } = req.query;

  // Validation (ensure userId is provided)
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required to fetch members' data.",
    });
  }

  try {
    // Fetch all member data based on userId
    const members = await Member.find({ userId });

    // Return success response, even if no members are found
    res.status(200).json({
      success: true,
      message:
        members.length > 0
          ? "Members fetched successfully."
          : "No members found for the given userId.",
      members,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to fetch members.",
      error: error.message,
    });
  }
};

// Delete a member by ID
exports.deleteMember = async (req, res) => {
  const { memberId } = req.params;

  // Validation (ensure memberId is provided)
  if (!memberId) {
    return res.status(400).json({
      success: false,
      message: "Member ID is required to delete the member.",
    });
  }

  try {
    // Find and delete the member by ID
    const deletedMember = await Member.findByIdAndDelete(memberId);

    if (!deletedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Member deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to delete member.",
      error: error.message,
    });
  }
};
