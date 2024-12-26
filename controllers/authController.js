const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secretKey = process.env.SECRET_KEY || "mahadev";

exports.registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, dob, contact, gender } =
    req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      contact,
      gender,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Create a JWT token for the user
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      secretKey,
      { expiresIn: "1h" }
    );

    // Send response with the token and userId
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      userId: savedUser._id,
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      userId: user._id,
      redirectUrl: "/",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
