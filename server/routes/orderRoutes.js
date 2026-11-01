import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("ORDER FETCH ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      items,
      total,
      payment_method,
      razorpay_payment_id,
      razorpay_order_id,
    } = req.body;

    // Validation
    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof total !== "number" ||
      total <= 0 ||
      !payment_method
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Create order
    const newOrder = new Order({
      user_id: req.user.id,
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
    console.error("ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
});

export default router;