import { useNavigate } from "react-router-dom";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import { COUPON_CODE, COUPON_DISCOUNT, COUPON_MINIMUM } from "../constants";

const inr = (n) => n.toLocaleString("en-IN");
const inr2 = (n) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CartDrawer({
  cart,
  increaseQty,
  decreaseQty,
  removeItem,
  totalAmount,
  isOpen,
  closeCart,
  openPayment,
  couponCode,
  setCouponCode,
  couponApplied,
  setCouponApplied,
  couponMessage,
  handleApplyCoupon,
  handleRemoveCoupon,
  couponDiscount,
  deliveryFee,
  finalTotal,
}) {
  const navigate = useNavigate();
  const gstAmount = Number(((totalAmount - couponDiscount) * 0.05).toFixed(2));

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Your cart"
      className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#f6f5ef] shadow-2xl transition-[transform,visibility] duration-300 ${
        isOpen ? "translate-x-0 visible" : "translate-x-full invisible"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#e3e1d6] bg-white px-5 py-4">
        <h2 className="font-display text-2xl font-extrabold">Your cart</h2>
        <button
          onClick={closeCart}
          aria-label="Close cart"
          className="rounded-full p-2 text-[#6b7468] hover:bg-[#f6f5ef] hover:text-[#17251d]"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {cart.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="font-display text-xl font-bold">Your cart is empty</p>
            <p className="mt-1 text-sm text-[#6b7468]">Add a few dishes from the menu to get started.</p>
            <button
              onClick={() => {
                closeCart();
                navigate("/menu");
              }}
              className="mt-5 rounded-md bg-[#17251d] px-6 py-3 font-bold text-white hover:bg-[#22372b]"
            >
              Browse the menu
            </button>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-xl border border-[#e3e1d6] bg-white p-3">
              <img src={item.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-semibold">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="text-[#6b7468] hover:text-[#c23b22]"
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-md border border-[#e3e1d6]">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center hover:bg-[#f6f5ef]"
                    >
                      <MinusIcon width={14} height={14} />
                    </button>
                    <span className="min-w-[1.75rem] text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center hover:bg-[#f6f5ef]"
                    >
                      <PlusIcon width={14} height={14} />
                    </button>
                  </div>
                  <p className="font-bold">₹{inr(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div className="rounded-xl border border-dashed border-[#c9c6b6] bg-white p-4">
            <label htmlFor="coupon" className="text-sm font-semibold">Coupon code</label>
            <div className="mt-2 flex gap-2">
              <input
                id="coupon"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  if (couponApplied) setCouponApplied(false);
                }}
                placeholder="Enter code"
                className="w-full rounded-md border border-[#e3e1d6] px-3 py-2.5 text-sm focus:border-[#17251d] focus:outline-none"
              />
              <button
                onClick={couponApplied ? handleRemoveCoupon : handleApplyCoupon}
                className={`shrink-0 rounded-md px-4 py-2.5 text-sm font-bold ${
                  couponApplied
                    ? "border border-[#c23b22] text-[#c23b22] hover:bg-[#c23b22]/10"
                    : "bg-[#17251d] text-white hover:bg-[#22372b]"
                }`}
              >
                {couponApplied ? "Remove" : "Apply"}
              </button>
            </div>

            {couponMessage && (
              <p className={`mt-2 text-sm ${couponApplied ? "text-[#1f8a4c]" : "text-[#c23b22]"}`}>
                {couponMessage}
              </p>
            )}

            {!couponApplied && (
              <button
                onClick={() => setCouponCode(COUPON_CODE)}
                className="mt-3 w-full rounded-md bg-[#f2a93b]/20 px-3 py-2 text-left text-sm"
              >
                <span className="font-bold">{COUPON_CODE}</span>
                <span className="text-[#6b7468]">
                  {" "}saves ₹{COUPON_DISCOUNT} on orders above ₹{COUPON_MINIMUM}. Tap to use.
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-[#e3e1d6] bg-white px-5 py-4">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#6b7468]">Subtotal</dt>
              <dd>₹{inr(totalAmount)}</dd>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-[#1f8a4c]">
                <dt>Coupon discount</dt>
                <dd>−₹{inr(couponDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#6b7468]">GST (5%)</dt>
              <dd>₹{gstAmount.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#6b7468]">Delivery</dt>
              <dd>₹{inr(deliveryFee)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#e3e1d6] pt-3">
              <dt className="font-bold">Total</dt>
              <dd className="font-display text-2xl font-extrabold">₹{inr2(finalTotal)}</dd>
            </div>
          </dl>
          <button
            onClick={openPayment}
            className="mt-4 w-full rounded-md bg-[#f2a93b] py-3.5 font-bold text-[#17251d] transition-transform hover:brightness-95 active:scale-[0.99]"
          >
            Checkout · ₹{inr2(finalTotal)}
          </button>
        </div>
      )}
    </aside>
  );
}
