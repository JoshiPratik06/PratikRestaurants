function CartDrawer({
  cart, increaseQty, decreaseQty, removeItem, totalAmount,
  isOpen, closeCart, openPayment, couponCode, setCouponCode,
  couponApplied, couponMessage, handleApplyCoupon, handleRemoveCoupon,
  couponDiscount, deliveryFee, finalTotal,
}) {
  // ✅ FIX: Use discounted subtotal for GST display in drawer
  const gstAmount = (totalAmount - couponDiscount) * 0.05;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl ring-1 ring-slate-900/5 z-50 transform transition-all duration-500 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-6 py-8 text-white relative flex-shrink-0">
        <button
          onClick={closeCart}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl hover:bg-white/20 rounded-full p-2 transition"
          aria-label="Close cart"
        >
          ✕
        </button>
        <p className="text-white/90 text-sm font-semibold mb-1">Your Order</p>
        <h2 className="text-3xl font-bold">Shopping Cart</h2>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {cart.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 p-6 text-center text-orange-700">
            <div className="text-3xl mb-2">🛒</div>
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm text-orange-600 mt-1">Start adding delicious items!</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 hover:border-orange-300 transition">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                  <p className="text-sm text-slate-500">₹{item.price}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg font-semibold transition"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="h-7 w-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-bold transition text-sm"
                  >−</button>
                  <span className="px-2 font-semibold text-slate-900 text-sm min-w-[1.5rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="h-7 w-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-bold transition text-sm"
                  >+</button>
                </div>
                <p className="font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-sm">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="text-sm font-semibold text-slate-700">Apply Coupon</div>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
              <button
                onClick={couponApplied ? handleRemoveCoupon : handleApplyCoupon}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  couponApplied ? "bg-red-500 text-white hover:bg-red-600" : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {couponApplied ? "Remove" : "Apply"}
              </button>
            </div>
            {couponMessage && (
              <p className={`text-sm ${couponApplied ? "text-green-600" : "text-red-600"}`}>
                {couponMessage}
              </p>
            )}
            {!couponApplied && (
              <div className="rounded-2xl bg-yellow-50 border border-yellow-300 p-3 text-xs text-yellow-800 space-y-1">
                <p className="font-semibold">🎁 Available Coupon</p>
                <p>
                  Code:{" "}
                  <span
                    className="font-bold text-orange-600 cursor-pointer hover:underline"
                    onClick={() => setCouponCode("Tandoori100")}
                  >
                    Tandoori100
                  </span>
                </p>
                <p>💸 Get ₹100 OFF</p>
                <p>📌 Minimum order: ₹295</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-200 bg-gradient-to-r from-orange-50 to-red-50 px-5 py-5 flex-shrink-0">
        <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Subtotal</span>
            <span className="font-bold text-slate-900">₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="font-semibold">Coupon Discount</span>
              <span className="font-bold">-₹{couponDiscount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">GST (5%)</span>
            <span className="font-bold text-orange-600">₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Delivery</span>
            <span className="font-bold text-slate-900">₹{deliveryFee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ₹{finalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        {cart.length > 0 && (
          <button
            onClick={openPayment}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white py-3 font-bold shadow-lg shadow-orange-300/50 hover:shadow-orange-400/70 transition duration-200"
          >
            💳 Checkout
          </button>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;