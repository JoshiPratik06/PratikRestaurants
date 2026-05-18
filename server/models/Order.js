import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        id: {
          type: String,
        },

        name: {
          type: String,
        },

        price: {
          type: Number,
        },

        quantity: {
          type: Number,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    payment_method: {
      type: String,
      required: true,
    },

    razorpay_payment_id: {
      type: String,
    },

    razorpay_order_id: {
      type: String,
    },

    payment_status: {
      type: String,
      default: "processed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);