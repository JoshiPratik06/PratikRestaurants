import express from "express";
import crypto from "node:crypto";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user_id: req.user.id,
      payment_status: { $ne: "pending" },
    })
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

router.get("/payment/:razorpayOrderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      user_id: req.user.id,
      razorpay_order_id: req.params.razorpayOrderId,
    }).select("payment_status razorpay_order_id");

    if (!order) {
      return res.status(404).json({ message: "Payment order not found" });
    }

    return res.status(200).json({
      success: true,
      payment_status: order.payment_status,
    });
  } catch (error) {
    console.error("PAYMENT STATUS ERROR:", error);
    return res.status(500).json({ message: "Failed to check payment status" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_signature,
      razorpay_payment_id,
      razorpay_order_id,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment confirmation is incomplete" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET is not configured");
      return res.status(500).json({ message: "Payment verification is not configured" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest();
    const providedSignature = Buffer.from(razorpay_signature, "hex");

    if (
      providedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(providedSignature, expectedSignature)
    ) {
      return res.status(400).json({ message: "Payment signature is invalid" });
    }

    const order = await Order.findOne({
      user_id: req.user.id,
      razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({ message: "Pending order was not found" });
    }

    order.payment_status = "paid";
    order.razorpay_payment_id = razorpay_payment_id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ message: "Failed to confirm payment" });
  }
});

export default router;