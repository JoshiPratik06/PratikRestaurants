import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

function PaymentModal({
  totalAmount,
  subtotal,
  couponDiscount,
  deliveryFee,
  closePayment,
  cart,
  setCart,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Netbanking");

  const [nbEmail, setNbEmail] = useState("");
  const [nbPassword, setNbPassword] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  const [upiId, setUpiId] = useState("");

  // ✅ Dynamic UPI QR
  const upiLink = `upi://pay?pa=pratikjoshi@oksbi&pn=Tandoori Tales&am=${totalAmount}&cu=INR`;

  const handlePayment = async () => {
    if (!cart || cart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      alert("Please login first!");
      return;
    }

    const user = JSON.parse(storedUser);

    // validations
    if (
      paymentMethod === "Netbanking" &&
      (!nbEmail || !nbPassword)
    ) {
      alert("Please enter Net Banking credentials");
      return;
    }

    if (
      paymentMethod === "Card" &&
      (!cardNumber ||
        !cardHolder ||
        !cvv ||
        !expiry)
    ) {
      alert("Please enter all card details");
      return;
    }

    if (
      paymentMethod === "UPI" &&
      !upiId
    ) {
      alert("Please enter UPI ID");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        {
          user_id: user._id || user.id,
          items: cart,
          total: Number(totalAmount),
          payment_method: paymentMethod,
        }
      );

      console.log(response.data);

      alert(
        `✅ Order placed successfully with ${paymentMethod}!`
      );

      setCart([]);

      localStorage.removeItem("cart");

      closePayment();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "❌ Failed to place order"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4">

      <div className="relative bg-white text-slate-900 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={closePayment}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 text-2xl hover:bg-slate-100 rounded-full p-2 transition z-10"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-0">

          {/* LEFT */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-8 md:border-r border-slate-200">

            <h2 className="text-2xl font-bold mb-6">
              Your Payment Details
            </h2>

            {/* Payment Methods */}
            <div className="mb-6">

              <label className="block text-sm font-semibold mb-3">
                Select Payment Method
              </label>

              <div className="grid gap-2">

                {[
                  {
                    key: "Netbanking",
                    label: "🏦 Net Banking",
                  },
                  {
                    key: "Card",
                    label: "💳 Debit/Credit Card",
                  },
                  {
                    key: "UPI",
                    label: "📱 UPI",
                  },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() =>
                      setPaymentMethod(option.key)
                    }
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition font-semibold ${
                      paymentMethod === option.key
                        ? "border-orange-500 bg-orange-50 text-slate-900"
                        : "border-slate-300 bg-white text-slate-700 hover:border-orange-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

              </div>
            </div>

            {/* Net Banking */}
            {paymentMethod === "Netbanking" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-orange-300 rounded-lg">

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Bank Email / User ID
                  </label>

                  <input
                    type="text"
                    placeholder="youremail@bank.com"
                    value={nbEmail}
                    onChange={(e) =>
                      setNbEmail(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={nbPassword}
                    onChange={(e) =>
                      setNbPassword(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

              </div>
            )}

            {/* Card */}
            {paymentMethod === "Card" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-blue-300 rounded-lg">

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Card Number
                  </label>

                  <input
                    type="text"
                    placeholder="1234567890123456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(
                        e.target.value.replace(/\s/g, "")
                      )
                    }
                    maxLength="16"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Cardholder Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) =>
                      setCardHolder(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Expiry Date
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(e.target.value)
                      }
                      maxLength="5"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      CVV
                    </label>

                    <input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value)
                      }
                      maxLength="3"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* UPI */}
            {paymentMethod === "UPI" && (
              <div className="space-y-5 p-5 bg-white border-2 border-dashed border-purple-300 rounded-2xl">

                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">
                    Scan & Pay
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Use PhonePe, Google Pay, Paytm or any UPI app
                  </p>
                </div>

                {/* QR */}
                <div className="flex justify-center">

                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200">

                    <QRCodeCanvas
                      value={upiLink}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />

                  </div>

                </div>

                {/* Details */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 space-y-2">

                  <div className="flex justify-between items-center">

                    <span className="text-slate-600 font-medium">
                      UPI ID
                    </span>

                    <span className="font-bold text-purple-700">
                      pratikjoshi@oksbi
                    </span>

                  </div>

                  <div className="flex justify-between items-center">

                    <span className="text-slate-600 font-medium">
                      Amount
                    </span>

                    <span className="text-xl font-extrabold text-green-600">
                      ₹{totalAmount.toFixed(2)}
                    </span>

                  </div>

                </div>

                {/* Manual UPI */}
                <div>

                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Or Enter Your UPI ID
                  </label>

                  <input
                    type="text"
                    placeholder="example@upi"
                    value={upiId}
                    onChange={(e) =>
                      setUpiId(e.target.value)
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                  />

                </div>

                {/* Apps */}
                <div className="flex justify-center gap-3 flex-wrap">

                  {[
                    "📱 GPay",
                    "💜 PhonePe",
                    "💙 Paytm",
                    "🏦 BHIM",
                  ].map((app) => (
                    <div
                      key={app}
                      className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700"
                    >
                      {app}
                    </div>
                  ))}

                </div>

              </div>
            )}

          </div>

          {/* RIGHT */}
          <div className="bg-white p-8">

            <h3 className="text-xl font-bold mb-6">
              Order Summary
            </h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 max-h-64 overflow-y-auto">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >

                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.name}
                    </p>

                    <p className="text-slate-600">
                      ×{item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    ₹
                    {(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>

                </div>
              ))}

            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">

              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>

                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">

                  <span>Coupon Discount</span>

                  <span>
                    -₹
                    {couponDiscount.toLocaleString("en-IN")}
                  </span>

                </div>
              )}

              <div className="flex justify-between text-slate-600">

                <span>GST (5%)</span>

                <span>
                  ₹
                  {(
                    (subtotal - couponDiscount) * 0.05
                  ).toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-slate-600">

                <span>Delivery</span>

                <span>
                  ₹{deliveryFee.toLocaleString("en-IN")}
                </span>

              </div>

            </div>

            {/* Final Total */}
            <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">

              <div className="flex justify-between">

                <span className="text-sm font-semibold text-slate-700">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-orange-600">
                  ₹
                  {totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>

              </div>

            </div>

            {/* Buttons */}
            <button
              onClick={handlePayment}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 font-bold shadow-lg hover:shadow-xl transition"
            >
              PAY NOW
            </button>

            <button
              onClick={closePayment}
              className="w-full mt-3 rounded-lg border-2 border-slate-300 bg-white text-slate-900 py-3 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PaymentModal;