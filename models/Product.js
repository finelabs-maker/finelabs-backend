const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    brandImg: { type: String, required: true },
    brandName: { type: String, required: true },
    productTitle: { type: String, required: true },
    productCode: { type: String, required: true, unique: true },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    currency: { type: String, required: true },
    productCategory: { type: String, required: true },
    productType: { type: String, required: true },
    discount: { type: String, required: true },
    description: { type: String, required: true },
    pretestInstructions: { type: [String], required: true },
    recommendedFor: { type: [String], required: true },
    reportIn: { type: String, required: true },
    parameterCovered: {
      covered: { type: [String], required: true },
      total: { type: Number, required: true },
    },
    sampleRequired: { type: [String], required: true },
    filterByBodyPart: { type: [String], required: true },
    filterByDisease: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
