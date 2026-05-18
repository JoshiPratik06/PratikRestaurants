import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Incoming Order Data:");
    console.log(req.body);

    const {
      user_id,
      items,
      total,
      payment_method,
      razorpay_payment_id,
      razorpay_order_id,
    } = req.body;

    // Validation
    if (
      !user_id ||
      !items ||
      !total ||
      !payment_method
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Create order
    const newOrder = new Order({
      user_id,
      items,
      total,
      payment_method,
      razorpay_payment_id: razorpay_payment_id || null,
      razorpay_order_id: razorpay_order_id || null,
    });

    // Save to MongoDB
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {

    console.log("ORDER ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;