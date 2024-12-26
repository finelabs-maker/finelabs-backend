const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date },
  contact: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  accountCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
