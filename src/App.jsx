import { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import foodItems from "./data";
import Register from "./Register";
import Login from "./Login";
import About from "./About";
import Contact from "./Contact";
import Orders from "./Orders";
import AdminDashboard from "./AdminDashboard";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

const DELIVERY_FEE = 23;
const COUPON_CODE = "Tandoori100";
const COUPON_DISCOUNT = 100;
const COUPON_MINIMUM = 295;

function safeReadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Invalid data found in localStorage for "${key}", resetting it.`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStoredUser() {
  const value = safeReadJSON("currentUser", null);
  return value && typeof value === "object" ? value : null;
}

function getStoredArray(key) {
  const value = safeReadJSON(key, []);
  return Array.isArray(value) ? value : [];
}

function getCartStorageKey(user) {
  return user?.id ? `cart_${user.id}` : "cart_guest";
}

function mergeCartItems(baseCart = [], incomingCart = []) {
  const map = new Map();

  [...baseCart, ...incomingCart].forEach((item) => {
    const existing = map.get(item.id);

    if (existing) {
      map.set(item.id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      map.set(item.id, { ...item });
    }
  });

  return Array.from(map.values());
}

export default function App() {
  const [toast, setToast] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const [user, setUser] = useState(() => getStoredUser());
  const [cart, setCart] = useState(() => {
    const storedUser = getStoredUser();
    return getStoredArray(getCartStorageKey(storedUser));
  });

  const toastTimerRef = useRef(null);
  const previousUserIdRef = useRef(user?.id ?? null);

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  const showToastMessage = (message, duration = 2200) => {
    setToast(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast("");
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const previousUserId = previousUserIdRef.current;
    const nextUserId = user?.id ?? null;

    if (previousUserId === nextUserId) return;

    if (previousUserId === null && nextUserId !== null) {
      const guestCart = getStoredArray("cart_guest");
      const userCart = getStoredArray(getCartStorageKey(user));
      const mergedCart = mergeCartItems(userCart, guestCart);

      setCart(mergedCart);
      writeJSON(getCartStorageKey(user), mergedCart);
      localStorage.removeItem("cart_guest");
    } else {
      setCart(getStoredArray(getCartStorageKey(user)));
    }

    previousUserIdRef.current = nextUserId;
  }, [user]);

  useEffect(() => {
    writeJSON(getCartStorageKey(user), cart);
  }, [cart, user]);

  useEffect(() => {
    const hasModalOpen =
      isCartOpen ||
      showPayment ||
      showLogin ||
      showRegister ||
      showAbout ||
      showContact ||
      showOrders ||
      showProfile;

    const overflowValue = hasModalOpen ? "hidden" : "";
    document.body.style.overflow = overflowValue;
    document.documentElement.style.overflow = overflowValue;

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [
    isCartOpen,
    showPayment,
    showLogin,
    showRegister,
    showAbout,
    showContact,
    showOrders,
    showProfile,
  ]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      if (showPayment) {
        setShowPayment(false);
        return;
      }

      if (showProfile) {
        setShowProfile(false);
        return;
      }

      if (showOrders) {
        setShowOrders(false);
        return;
      }

      if (showAbout) {
        setShowAbout(false);
        return;
      }

      if (showContact) {
        setShowContact(false);
        return;
      }

      if (showRegister) {
        setShowRegister(false);
        return;
      }

      if (showLogin) {
        setShowLogin(false);
        return;
      }

      if (isCartOpen) {
        setIsCartOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [
    isCartOpen,
    showPayment,
    showProfile,
    showOrders,
    showAbout,
    showContact,
    showRegister,
    showLogin,
  ]);

  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const couponDiscount = useMemo(() => {
    return couponApplied && totalAmount >= COUPON_MINIMUM ? COUPON_DISCOUNT : 0;
  }, [couponApplied, totalAmount]);

  const gstAmount = useMemo(() => {
    return Number(((totalAmount - couponDiscount) * 0.05).toFixed(2));
  }, [totalAmount, couponDiscount]);

  const deliveryCharge = totalAmount > 0 ? DELIVERY_FEE : 0;

  const finalTotal = useMemo(() => {
    return Number((totalAmount - couponDiscount + gstAmount + deliveryCharge).toFixed(2));
  }, [totalAmount, couponDiscount, gstAmount, deliveryCharge]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    if (totalAmount === 0) {
      setCouponApplied(false);
      setCouponCode("");
      setCouponMessage("");
      return;
    }

    if (couponApplied && totalAmount < COUPON_MINIMUM) {
      setCouponApplied(false);
      setCouponMessage(`Coupon removed: cart must be at least ₹${COUPON_MINIMUM}.`);
    }
  }, [totalAmount, couponApplied]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });

    showToastMessage(`${item.name} added to cart`);
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim();

    if (!code) {
      setCouponApplied(false);
      setCouponMessage("Enter a coupon code.");
      return;
    }

    if (code.toLowerCase() !== COUPON_CODE.toLowerCase()) {
      setCouponApplied(false);
      setCouponMessage("Invalid coupon code.");
      return;
    }

    if (totalAmount < COUPON_MINIMUM) {
      setCouponApplied(false);
      setCouponMessage(`Cart must be at least ₹${COUPON_MINIMUM} to use ${COUPON_CODE}.`);
      return;
    }

    setCouponApplied(true);
    setCouponMessage(`Coupon applied! ₹${COUPON_DISCOUNT} discount added.`);
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponMessage("Coupon removed.");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setShowProfile(false);
    setUser(null);
    showToastMessage("Logged out successfully");
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      const users = getStoredArray("users");
      const updatedUsers = users.filter((storedUser) => storedUser.id !== user.id);
      writeJSON("users", updatedUsers);

      const orders = getStoredArray("orders");
      const updatedOrders = orders.filter((order) => order.user_id !== user.id);
      writeJSON("orders", updatedOrders);

      localStorage.removeItem("currentUser");
      localStorage.removeItem(getCartStorageKey(user));

      setShowProfile(false);
      setUser(null);
      showToastMessage("Account deleted successfully", 3000);
    } catch (error) {
      console.error(error);
      alert("❌ Error deleting account");
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setShowLogin(false);
    showToastMessage(`Welcome back, ${loggedInUser.name}!`);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async () => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      showToastMessage("Unable to load Razorpay checkout. Please try again.");
      return;
    }

    const user = getStoredUser();
    if (!user) {
      showToastMessage("Please login to continue checkout");
      return;
    }

    const orderResponse = await axios.post(
      "https://pratikrestaurants.onrender.com/api/razorpay/order",
      {
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          user_id: user.id || user._id,
          payment_type: "Razorpay",
        },
      }
    );

    const razorpayOrder = orderResponse.data.order;
    if (!razorpayOrder || !razorpayOrder.id) {
      showToastMessage("Unable to initialize Razorpay payment. Please try again.");
      return;
    }

    const razorpayOptions = {
      key: orderResponse.data.key_id || "rzp_test_YourKeyHere",
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      name: "Tandoori Tales",
      description: "Order payment",
      order_id: razorpayOrder.id,
      handler: async function (response) {
        if (!response?.razorpay_payment_id) {
          showToastMessage("Payment failed or was cancelled. Please try again.");
          return;
        }

        try {
          await axios.post("https://pratikrestaurants.onrender.com/api/orders", {
            user_id: user.id || user._id,
            items: cart,
            total: Number(finalTotal),
            payment_method: "Razorpay",
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
          });

          setCart([]);
          localStorage.removeItem("cart");
          showToastMessage("✅ Order placed successfully with Razorpay!");
        } catch (error) {
          console.error("Razorpay order post error:", error);
          showToastMessage(
            error.response?.data?.message ||
              "❌ Payment succeeded but order placement failed. Please contact support."
          );
        }
      },
      prefill: {
        name: user.name || user.username || "",
        email: user.email || "",
      },
      notes: {
        payment_type: "Razorpay",
      },
      theme: {
        color: "#f97316",
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  };

  const handleStartCheckout = () => {
    if (cart.length === 0) {
      showToastMessage("Your cart is empty");
      return;
    }

    if (!isLoggedIn) {
      setIsCartOpen(false);
      setShowLogin(true);
      showToastMessage("Please login to continue checkout");
      return;
    }

    openRazorpayCheckout();
  };

  return (
    <>
      {showAbout && <About close={() => setShowAbout(false)} />}
      {showContact && <Contact close={() => setShowContact(false)} />}
      {showOrders && user && (
        <Orders close={() => setShowOrders(false)} user={user} />
      )}

      {showLogin && (
        <Login
          close={() => setShowLogin(false)}
          setUser={handleLoginSuccess}
          openRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register
          close={() => setShowRegister(false)}
          openLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}

      <div className="min-h-screen flex flex-col bg-gray-100 transition-colors duration-300">
        <Navbar
          cartCount={totalItems}
          openCart={() => setIsCartOpen(true)}
          openRegister={() => setShowRegister(true)}
          openLogin={() => setShowLogin(true)}
          openProfile={() => setShowProfile(true)}
          user={user}
          isAdmin={isAdmin}
        />

        {showProfile && user && (
          <ProfileModal
            user={user}
            close={() => setShowProfile(false)}
            openOrders={() => {
              setShowOrders(true);
              setShowProfile(false);
            }}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Hero />} />

            <Route
              path="/menu"
              element={
                <div id="menu-section" className="scroll-mt-24">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                  <FoodGrid
                    addToCart={addToCart}
                    selectedCategory={selectedCategory}
                  />
                </div>
              }
            />

            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard user={user} /> : <AdminGate />}
            />
          </Routes>
        </div>

        {isCartOpen && (
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}

        <CartDrawer
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          removeItem={removeItem}
          totalAmount={totalAmount}
          isOpen={isCartOpen}
          closeCart={() => setIsCartOpen(false)}
          openPayment={handleStartCheckout}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          couponApplied={couponApplied}
          setCouponApplied={setCouponApplied}
          couponMessage={couponMessage}
          handleApplyCoupon={handleApplyCoupon}
          handleRemoveCoupon={handleRemoveCoupon}
          couponDiscount={couponDiscount}
          deliveryFee={deliveryCharge}
          finalTotal={finalTotal}
        />

        {/*
        {showPayment && (
          <PaymentModal
            payableAmount={finalTotal}
            subtotal={totalAmount}
            couponDiscount={couponDiscount}
            deliveryFee={deliveryCharge}
            closePayment={() => setShowPayment(false)}
            cart={cart}
            setCart={setCart}
            showToast={showToastMessage}
          />
        )}
        */}

        <Footer
          openAbout={() => setShowAbout(true)}
          openContact={() => setShowContact(true)}
        />
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeUp">
          {toast}
        </div>
      )}
    </>
  );
}

function AdminGate() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 text-center shadow-2xl shadow-black/40">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">
          Admin Required
        </p>
        <h2 className="text-4xl font-bold mb-4">Access Denied</h2>
        <p className="text-slate-400 mb-8">
          You must be logged in as an admin to view this page. Please sign in with
          an admin account.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-white font-semibold hover:bg-orange-400 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ProfileModal({ user, close, openOrders, onLogout, onDeleteAccount }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
      <div className="bg-slate-950 text-white p-6 rounded-[2rem] w-full max-w-sm border border-slate-800 shadow-2xl shadow-black/40">
        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>

        <p className="text-slate-300">
          <b>Name:</b> {user.name}
        </p>
        <p className="text-slate-300 mb-4">
          <b>Email:</b> {user.email}
        </p>

        {user.role !== "admin" && (
          <button
            onClick={openOrders}
            className="w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold"
          >
            📦 My Orders
          </button>
        )}

        <button
          onClick={onDeleteAccount}
          className="w-full mt-3 bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-400 transition"
        >
          🗑️ Delete Account
        </button>

        <button
          onClick={onLogout}
          className="w-full mt-3 bg-red-500 text-white py-3 rounded-xl font-semibold"
        >
          Logout
        </button>

        <button
          onClick={close}
          className="mt-4 w-full text-slate-400 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function Navbar({
  cartCount,
  openCart,
  openRegister,
  openLogin,
  openProfile,
  user,
  isAdmin,
}) {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-black backdrop-blur-md text-white px-6 py-3 flex justify-between items-center shadow-xl border-b border-orange-500/20">
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide text-[#f4b400] hover:opacity-90 transition"
      >
        Tandoori Tales 🔥
      </Link>

      <div className="flex items-center gap-3 md:gap-4">
        {isAdmin && (
          <Link
            to="/admin"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 text-sm font-semibold text-slate-100 hover:bg-slate-700 transition"
          >
            🛠️ Admin
          </Link>
        )}

        {user ? (
          <button
            onClick={openProfile}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <span className="text-xl">👤</span>
            <span className="hidden sm:inline font-medium">{user.name}</span>
          </button>
        ) : (
          <>
            <button
              onClick={openRegister}
              className="px-4 py-3 md:py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
            >
              Register
            </button>

            <button
              onClick={openLogin}
              className="px-4 py-3 md:py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 active:scale-95 transition"
            >
              Login
            </button>
          </>
        )}

        <button
          onClick={openCart}
          className="relative flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white w-11 h-11 rounded-full font-semibold shadow-lg shadow-orange-500/50 hover:scale-105 active:scale-95 transition"
        >
          <span className="text-xl">🛒</span>

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const navigate = useNavigate();

  const handleScrollToMenu = () => {
    navigate("/menu");

    const scrollWhenReady = (attempt = 0) => {
      const menuSection = document.getElementById("menu-section");

      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (attempt < 12) {
        setTimeout(() => scrollWhenReady(attempt + 1), 80);
      }
    };

    setTimeout(() => scrollWhenReady(), 80);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="food"
          className="w-full h-full object-cover brightness-110 contrast-110 saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 text-white px-6 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-sans tracking-wide">
          Tandoori Tales
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8 font-serif">
          Where Every Bite Tells a Story 🍽️
        </p>

        <button
          onClick={handleScrollToMenu}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl transition transform hover:scale-105 active:scale-95"
        >
          🍽️ View Dishes
        </button>
      </div>
    </div>
  );
}

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const categories = ["All", "Veg", "Non-Veg", "Starter", "Non-Veg Starter", "Bread"];

  return (
    <div className="flex justify-center gap-3 mt-8 px-4 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
            selectedCategory === category
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200/50"
              : "bg-white text-slate-700 border border-slate-300 hover:border-orange-400 hover:text-orange-600 shadow-sm"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function FoodGrid({ addToCart, selectedCategory }) {
  const filteredItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-10">
      {filteredItems.map((item) => (
        <FoodCard key={item.id} item={item} addToCart={addToCart} />
      ))}
    </div>
  );
}

function FoodCard({ item, addToCart }) {
  return (
    <div className="group bg-white rounded-[2rem] shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-slate-100">
      <div className="relative overflow-hidden h-52 bg-slate-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
          {item.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            ₹{item.price}
          </p>
          <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
            ⭐ Fresh
          </span>
        </div>

        <button
          onClick={() => addToCart(item)}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 font-semibold shadow-lg shadow-orange-200/50 hover:opacity-95 active:scale-95 transition-all"
        >
          <span className="text-xl">🛒 Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

function CartDrawer({
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
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl ring-1 ring-slate-900/5 z-50 transform transition-all duration-500 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
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

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {cart.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 p-6 text-center text-orange-700 space-y-3">
            <div className="text-5xl">🍛</div>
            <p className="font-semibold text-lg">Your cart is empty</p>
            <p className="text-sm">Add some delicious dishes to get started!</p>

            <button
              onClick={() => {
                closeCart();
                navigate("/menu");
              }}
              className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 hover:border-orange-300 transition"
            >
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 line-clamp-1">
                    {item.name}
                  </h4>
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
                  >
                    −
                  </button>
                  <span className="px-2 font-semibold text-slate-900 text-sm min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="h-7 w-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-bold transition text-sm"
                  >
                    +
                  </button>
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
            <div className="text-sm font-semibold text-slate-700">
              Apply Coupon
            </div>

            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  if (couponApplied) {
                    setCouponApplied(false);
                  }
                }}
                placeholder="Enter coupon code"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />

              <button
                onClick={couponApplied ? handleRemoveCoupon : handleApplyCoupon}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  couponApplied
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {couponApplied ? "Remove" : "Apply"}
              </button>
            </div>

            {couponMessage && (
              <p
                className={`text-sm ${
                  couponApplied ? "text-green-600" : "text-red-600"
                }`}
              >
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
                    onClick={() => setCouponCode(COUPON_CODE)}
                  >
                    {COUPON_CODE}
                  </span>
                </p>
                <p>💸 Get ₹100 OFF</p>
                <p>📌 Minimum order: ₹{COUPON_MINIMUM}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t-2 border-slate-200 bg-gradient-to-r from-orange-50 to-red-50 px-5 py-5 flex-shrink-0">
        <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Subtotal</span>
            <span className="font-bold text-slate-900">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="font-semibold">Coupon Discount</span>
              <span className="font-bold">
                -₹{couponDiscount.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">GST (5%)</span>
            <span className="font-bold text-orange-600">₹{gstAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Delivery</span>
            <span className="font-bold text-slate-900">
              ₹{deliveryFee.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ₹
              {finalTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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

function Footer({ openAbout, openContact }) {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-black text-white py-10 mt-auto border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Tandoori Tales
            </h3>
            <p className="text-slate-400 text-sm">
              Where Every Bite Tells a Story
            </p>
          </div>

          <div className="flex justify-center gap-8">
            <button
              onClick={openAbout}
              className="text-slate-300 hover:text-orange-400 transition font-semibold"
            >
              About Us
            </button>
            <button
              onClick={openContact}
              className="text-slate-300 hover:text-orange-400 transition font-semibold"
            >
              Contact
            </button>
          </div>

          <div className="text-right">
            <p className="text-slate-400 text-sm mb-2">Follow Us</p>
            <div className="flex justify-end gap-2">
              {["f", "📷", "𝕏", "▶"].map((icon, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/40 flex items-center justify-center transition text-sm"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 Tandoori Tales Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PaymentModal({
  payableAmount,
  subtotal,
  couponDiscount,
  deliveryFee,
  closePayment,
  cart,
  setCart,
  showToast,
}) {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [nbEmail, setNbEmail] = useState("");
  const [nbPassword, setNbPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiOption, setUpiOption] = useState("QR");
  const [formError, setFormError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, "").slice(0, 16);
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const upiLink = `upi://pay?pa=pratikjoshi@oksbi&pn=Tandoori Tales&am=${encodeURIComponent(
    payableAmount.toFixed(2)
  )}&cu=INR`;

  const validatePaymentForm = () => {
    if (paymentMethod === "Netbanking") {
      if (!nbEmail.trim() || nbPassword.trim().length < 4) {
        return "Please enter valid net banking details.";
      }
    }

    if (paymentMethod === "Card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        return "Card number must be 16 digits.";
      }

      if (!cardHolder.trim()) {
        return "Please enter cardholder name.";
      }

      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return "Expiry must be in MM/YY format.";
      }

      if (!/^\d{3}$/.test(cvv)) {
        return "CVV must be 3 digits.";
      }
    }

    if (paymentMethod === "UPI" && upiOption === "UPI") {
      if (!/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/i.test(upiId.trim())) {
        return "Please enter a valid UPI ID.";
      }
    }

    return "";
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setFormError("");
    const validationError = validatePaymentForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!cart || cart.length === 0) {
      setFormError("🛒 Cart is empty");
      return;
    }

    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      setFormError("Please login first");
      return;
    }

    const user = JSON.parse(storedUser);
    const selectedPaymentMethod =
      paymentMethod === "UPI"
        ? upiOption === "QR"
          ? "QR UPI"
          : "UPI ID"
        : paymentMethod;

    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      setFormError("Unable to load Razorpay checkout. Please try again.");
      return;
    }

    const razorpayOptions = {
      key: "rzp_test_YourKeyHere",
      amount: Math.round(payableAmount * 100),
      currency: "INR",
      name: "Tandoori Tales",
      description: `Payment via ${selectedPaymentMethod}`,
      handler: async function (response) {
        if (!response?.razorpay_payment_id) {
          setFormError("Payment failed or was cancelled. Please try again.");
          return;
        }

        try {
          setIsPlacingOrder(true);
          await axios.post("https://pratikrestaurants.onrender.com/api/orders", {
            user_id: user.id || user._id,
            items: cart,
            total: Number(payableAmount),
            payment_method: selectedPaymentMethod,
            razorpay_payment_id: response.razorpay_payment_id,
          });

          showToast(`✅ Order placed successfully with ${selectedPaymentMethod}!`);
          setCart([]);
          localStorage.removeItem("cart");
          setIsPlacingOrder(false);
          closePayment();
        } catch (error) {
          console.error("Razorpay order post error:", error);
          setIsPlacingOrder(false);
          setFormError(
            error.response?.data?.message ||
              "❌ Payment succeeded but order placement failed. Please contact support."
          );
        }
      },
      prefill: {
        name: user.name || user.username || "",
        email: user.email || "",
      },
      notes: {
        payment_type: selectedPaymentMethod,
      },
      theme: {
        color: "#f97316",
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4">
      <div className="relative bg-white text-slate-900 w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={closePayment}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 text-2xl hover:bg-slate-100 rounded-full p-2 transition z-10"
          aria-label="Close payment"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-slate-50 to-white p-8 md:border-r border-slate-200">
            <h2 className="text-2xl font-bold mb-2">Your Payment Details</h2>
            <p className="text-sm text-slate-500 mb-6">
              Demo checkout flow for your restaurant website.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Select Payment Method
              </label>
              <div className="grid gap-2">
                {[
                  { key: "Netbanking", label: "🏦 Net Banking" },
                  { key: "Card", label: "💳 Debit/Credit Card" },
                  { key: "UPI", label: "📱 UPI" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setPaymentMethod(option.key);
                      setFormError("");
                    }}
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

            {paymentMethod === "Netbanking" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-orange-300 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">
                  Enter your demo net banking details
                </p>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Bank Email / User ID
                  </label>
                  <input
                    type="text"
                    placeholder="youremail@bank.com"
                    value={nbEmail}
                    onChange={(e) => setNbEmail(e.target.value)}
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
                    onChange={(e) => setNbPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "Card" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-blue-300 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">
                  Enter your demo card details
                </p>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
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
                    onChange={(e) => setCardHolder(e.target.value)}
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
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      maxLength={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "UPI" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-purple-300 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">
                  Choose UPI payment option
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { key: "QR", label: "QR" },
                    { key: "UPI", label: "UPI ID" },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setUpiOption(option.key);
                        setFormError("");
                      }}
                      className={`py-3 rounded-lg border-2 font-semibold transition ${
                        upiOption === option.key
                          ? "border-purple-500 bg-purple-50 text-slate-900"
                          : "border-slate-300 bg-white text-slate-600 hover:border-purple-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {upiOption === "QR" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Scan this QR with any UPI app.
                    </p>

                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-2xl shadow-lg border border-purple-200 inline-block">
                        <QRCodeCanvas
                          value={upiLink}
                          size={220}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Enter Your UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="example@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {formError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}
          </div>

          <div className="bg-white p-8">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-slate-600">×{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span>₹{((subtotal - couponDiscount) * 0.05).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>₹{deliveryFee.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700">
                  Total Amount (Including GST + Delivery)
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  ₹
                  {payableAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isPlacingOrder}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 font-bold shadow-lg hover:shadow-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? "Processing..." : "PAY NOW"}
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
