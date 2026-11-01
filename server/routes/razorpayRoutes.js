import express from "express";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

function hasValidSignature(body, signature, secret) {
  if (!Buffer.isBuffer(body) || typeof signature !== "string") {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(body).digest();
  const provided = Buffer.from(signature, "hex");

  return provided.length === expected.length &&
    crypto.timingSafeEqual(provided, expected);
}

router.post("/webhook", async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
    return res.status(500).json({ message: "Webhook is not configured" });
  }

  if (!hasValidSignature(
    req.rawBody,
    req.headers["x-razorpay-signature"],
    webhookSecret
  )) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const { event, payload } = req.body;
  if (event !== "payment.captured" && event !== "order.paid") {
    return res.status(200).json({ received: true });
  }

  const payment = payload?.payment?.entity;
  const gatewayOrder = payload?.order?.entity;
  const razorpayOrderId = payment?.order_id || gatewayOrder?.id;
  const paymentId = payment?.id || gatewayOrder?.payment_id;

  if (!razorpayOrderId) {
    return res.status(400).json({ message: "Webhook is missing the order ID" });
  }

  try {
    const order = await Order.findOne({ razorpay_order_id: razorpayOrderId });
    if (!order) {
      console.error("Captured Razorpay payment has no matching pending order:", razorpayOrderId);
      return res.status(500).json({ message: "Matching order is not available yet" });
    }

    const capturedAmount = payment?.amount ?? gatewayOrder?.amount_paid;
    if (
      typeof capturedAmount === "number" &&
      typeof order.razorpay_amount === "number" &&
      capturedAmount !== order.razorpay_amount
    ) {
      console.error("Razorpay payment amount does not match pending order:", razorpayOrderId);
      return res.status(400).json({ message: "Payment amount does not match the order" });
    }

    order.payment_status = "paid";
    if (paymentId) {
      order.razorpay_payment_id = paymentId;
    }
    await order.save();

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);
    return res.status(500).json({ message: "Failed to process payment webhook" });
  }
});

router.post("/order", authMiddleware, async (req, res) => {
  try {
    const {
      amount,
      total,
      items,
      currency = "INR",
      receipt,
      notes,
    } = req.body;

    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      typeof total !== "number" ||
      !Number.isFinite(total) ||
      total <= 0 ||
      Math.round(total * 100) !== amount ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some((item) =>
        !item ||
        typeof item.name !== "string" ||
        !Number.isFinite(Number(item.price)) ||
        Number(item.price) <= 0 ||
        !Number.isSafeInteger(Number(item.quantity)) ||
        Number(item.quantity) <= 0
      )
    ) {
      return res.status(400).json({
        message: "A valid amount and at least one valid item are required",
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay credentials are not configured on the server.",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);
    await Order.create({
      user_id: req.user.id,
      items: items.map((item) => ({
        id: String(item.id || ""),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      total,
      payment_method: "Razorpay",
      razorpay_order_id: order.id,
      razorpay_amount: amount,
      payment_status: "pending",
    });

    return res.status(201).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({ message: "Failed to initialize payment" });
  }
});

export default router;
