const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: false,
    },
    userDetails: {
      name: {
        type: String,
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    patient: [
      {
        name: {
          type: String,
          required: true,
        },
        dob: {
          type: Date,
          required: false,
        },
        gender: {
          type: String,
          enum: ["male", "female", "other"],
          required: false,
        },
      },
    ],
    address: [
      {
        type: {
          type: String,
          required: true,
        },
        house: {
          type: String,
          required: true,
        },
        area: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
      },
    ],
    paymentDetails: {
      cartTotal: {
        type: String,
        required: true,
      },
      collectionCharges: {
        type: String,
        default: 0,
      },
      discount: {
        type: String,
        default: 0,
      },
      platformFee: {
        type: String,
        default: 0,
      },
      finalAmount: {
        type: String,
        required: true,
      },
    },
    collectionDate: {
      date: {
        year: {
          type: Number,
          required: true,
        },
        month: {
          type: String,
          required: true,
        },
        day: {
          type: Number,
          required: true,
        },
      },
      time: {
        type: String,
        required: true,
      },
    },
    geoLocation: {
      longitude: {
        type: String,
        required: false,
      },
      latitude: {
        type: String,
        required: false,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
