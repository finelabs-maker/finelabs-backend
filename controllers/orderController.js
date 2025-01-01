const Order = require("../models/Order");
const Product = require("../models/Product");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createOrder = async (req, res) => {
  try {
    const { userId, ...orderData } = req.body;

    // Create new order and associate with userId
    const newOrder = new Order({
      userId,
      ...orderData,
    });

    await newOrder.save();

    // Fetch the brandName from the first product in the items array
    const product = await Product.findById(newOrder.items[0].productId);
    const brandName = product ? product.brandName : "Unknown Brand";

    let msg = {};

    // Email content for Pathkind Labs
    if (brandName === "Pathkind Labs") {
      msg = {
        to: "appointment@pathkindlabs.com", // Primary recipient
        from: "order@finelabs.in", // Ensure this email is verified with your email service provider
        cc: [
          "rahul.kumar@pathkindlabs.com",
          "deepak.singh@pathkindlabs.com",
          "dolagovinda.pradhan@pathkindlabs.com",
          "neeraj.negi@pathkindlabs.com",
          "shashikant.singh@pathkindlabs.com",
        ], // List of CC recipients
        subject: "Appointment Requirement",
        text: `Dear ${brandName}, please arrange a home collection for the below customer with order ID ${newOrder._id}.`,
        html: `
        <p>Dear ${brandName}, please arrange a home collection for the below customer with order ID ${
          newOrder._id
        }.</p>
          <p><strong>Customer Details:</strong></p>
          <p><strong>Name:</strong> ${newOrder.userDetails.name}</p>
          <p><strong>Contact:</strong> ${newOrder.userDetails.contact}</p>
          <p><strong>Email:</strong> ${newOrder.userDetails.email}</p>
          
          <p><strong>Patient Details:</strong></p>
          ${newOrder.patient
            .map(
              (patient) => `
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>DOB:</strong> ${patient.dob ? patient.dob : "N/A"}</p>
            <p><strong>Gender:</strong> ${patient.gender || "N/A"}</p>
          `
            )
            .join("")}
          
          <p><strong>Collection Date & Time:</strong> ${
            newOrder.collectionDate.date.day
          } ${newOrder.collectionDate.date.month}, ${
          newOrder.collectionDate.date.year
        } at ${newOrder.collectionDate.time}</p>
          
          <p><strong>Delivery Address:</strong></p>
          ${newOrder.address
            .map(
              (address) => `
            <p><strong>House:</strong> ${address.house}</p>
            <p><strong>Area:</strong> ${address.area}</p>
            <p><strong>Pincode:</strong> ${address.pincode}</p>
            <p><strong>State:</strong> ${address.state}</p>
            <p><strong>City:</strong> ${address.city}</p>
            <p><strong>Type:</strong> ${address.type}</p>
          `
            )
            .join("")}
          
          ${
            newOrder.geoLocation.longitude && newOrder.geoLocation.latitude
              ? `
            <p><strong>Geo Location:</strong> Latitude - ${newOrder.geoLocation.latitude}, Longitude - ${newOrder.geoLocation.longitude}</p>
          `
              : ""
          }
          
          <p>Thank you</p>
          <p>Best Regards,</p>
          <p>Fine Labs</p>
        `,
      };
    }
    // Email content for Redcliffe Labs
    else if (brandName === "Redcliffe Labs") {
      msg = {
        to: "appointments@redcliffelabs.com", // Primary recipient
        from: "order@finelabs.in", // Ensure this email is verified with your email service provider
        cc: ["sagar.kapoor@redcliffelabs.com"], // List of CC recipients
        subject: "Appointment Requirement",
        text: `Dear ${brandName}, please arrange a home collection for the below customer with order ID ${newOrder._id}.`,
        html: `
        <p>Dear ${brandName}, please arrange a home collection for the below customer with order ID ${
          newOrder._id
        }.</p>
          <p><strong>Customer Details:</strong></p>
          <p><strong>Name:</strong> ${newOrder.userDetails.name}</p>
          <p><strong>Contact:</strong> ${newOrder.userDetails.contact}</p>
          <p><strong>Email:</strong> ${newOrder.userDetails.email}</p>
          
          <p><strong>Patient Details:</strong></p>
          ${newOrder.patient
            .map(
              (patient) => `
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>DOB:</strong> ${patient.dob ? patient.dob : "N/A"}</p>
            <p><strong>Gender:</strong> ${patient.gender || "N/A"}</p>
          `
            )
            .join("")}
          
          <p><strong>Collection Date & Time:</strong> ${
            newOrder.collectionDate.date.day
          } ${newOrder.collectionDate.date.month}, ${
          newOrder.collectionDate.date.year
        } at ${newOrder.collectionDate.time}</p>
          
          <p><strong>Delivery Address:</strong></p>
          ${newOrder.address
            .map(
              (address) => `
            <p><strong>House:</strong> ${address.house}</p>
            <p><strong>Area:</strong> ${address.area}</p>
            <p><strong>Pincode:</strong> ${address.pincode}</p>
            <p><strong>State:</strong> ${address.state}</p>
            <p><strong>City:</strong> ${address.city}</p>
            <p><strong>Type:</strong> ${address.type}</p>
          `
            )
            .join("")}
          
          ${
            newOrder.geoLocation.longitude && newOrder.geoLocation.latitude
              ? `
            <p><strong>Geo Location:</strong> Latitude - ${newOrder.geoLocation.latitude}, Longitude - ${newOrder.geoLocation.longitude}</p>
          `
              : ""
          }
          
          <p>Thank you</p>
          <p>Best Regards,</p>
          <p>Fine Labs</p>
        `,
      };
    }

    // Send the email
    await sgMail.send(msg);
    console.log("Order confirmation email sent successfully.");

    // Respond to the client
    return res.status(201).json({
      success: true,
      message: "Order created successfully and email sent.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get Orders for the authenticated user
exports.getOrders = async (req, res) => {
  const { userId } = req.query;

  // Validate that the userId is provided
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required to fetch orders.",
    });
  }

  try {
    // Fetch orders for the given userId and populate all product fields
    const orders = await Order.find({ userId })
      .populate({
        path: "items.productId", // Reference to Product model
      })
      .exec(); // Execute the query to fetch data

    // Return success response, even if no orders are found
    res.status(200).json({
      success: true,
      message:
        orders.length > 0
          ? "Orders fetched successfully."
          : "No orders found for the given user.",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to fetch orders.",
      error: error.message,
    });
  }
};
