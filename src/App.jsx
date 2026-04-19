import { useState, useEffect } from "react";
import foodItems from "./data";
import Register from "./Register";
import Login from "./Login";
import About from "./About";
import Contact from "./Contact";
import Orders from "./Orders";
import AdminDashboard from "./AdminDashboard";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import upiQRCode from "./assets/uipqrcode.png";

export default function App() {
const [showProfile, setShowProfile] = useState(false);
  const [ toast, setToast ] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (!savedCart) return [];
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.warn("Invalid cart data in localStorage, resetting cart.", error);
      localStorage.removeItem("cart");
      return [];
    }
  });
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const DELIVERY_FEE = 23;
  const COUPON_CODE = "Tandoori100";
  const COUPON_DISCOUNT = 100;

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.warn("Invalid currentUser data in localStorage, resetting user.", error);
      localStorage.removeItem("currentUser");
      return null;
    }
  });

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

 const handleDeleteAccount = () => {
  if (!user) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete your account?"
  );
  if (!confirmed) return;

  try {
    // get users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // remove current user
    const updatedUsers = users.filter((u) => u.id !== user.id);

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // also remove their orders (optional but good)
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = orders.filter(
      (o) => o.user_id !== user.id
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // logout
    setUser(null);
    localStorage.removeItem("currentUser");

    setShowProfile(false);

    setToast("Account deleted successfully.");
    setTimeout(() => setToast(""), 3000);

  } catch (err) {
    console.error(err);
    alert("❌ Error deleting account");
  }
};

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
  }, [isCartOpen, showPayment, showLogin, showRegister, showAbout, showContact, showOrders, showProfile]);

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setToast(`${item.name} added to cart!`);
    setTimeout(() => setToast(""), 2000);
  };

  

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // total price
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const couponDiscount = couponApplied && totalAmount > 294 ? COUPON_DISCOUNT : 0;
  const gstAmount = ((totalAmount - couponDiscount) * 0.05);
  const finalTotal = totalAmount - couponDiscount + gstAmount + DELIVERY_FEE;

  useEffect(() => {
    if (couponApplied && totalAmount <= 294) {
      setCouponApplied(false);
      setCouponMessage("Coupon removed: cart must exceed ₹294.");
    }
  }, [totalAmount, couponApplied]);

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

    if (totalAmount <= 294) {
      setCouponApplied(false);
      setCouponMessage("Cart must be over ₹294 to use Tandoori100.");
      return;
    }

    setCouponApplied(true);
    setCouponMessage("Coupon applied! ₹100 discount added.");
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponMessage("Coupon removed.");
  };

  // total items
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
  <>
    {showAbout && <About close={() => setShowAbout(false)} />}
    {showContact && <Contact close={() => setShowContact(false)} />}
    {showOrders && <Orders close={() => setShowOrders(false)} user={user} />}
    {showLogin && (
      <Login
        close={() => setShowLogin(false)}
        setUser={setUser}
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

    <div>
      <div className="min-h-screen flex flex-col bg-gray-100 transition-colors duration-300">

       <Navbar
  cartCount={totalItems}
  openCart={() => setIsCartOpen(true)}
  openRegister={() => setShowRegister(true)}
  openLogin={() => setShowLogin(true)}
  openProfile={() => setShowProfile(true)}
  user={user}
  isAdmin={isAdmin}
  isLoggedIn={isLoggedIn}
  onLogout={handleLogout}
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

            {/* HOME PAGE */}
            <Route
              path="/"
              element={
                <Hero />
              }
            />

            {/* MENU PAGE */}
            <Route
              path="/menu"
              element={
                <>
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />

                  <FoodGrid
                    addToCart={addToCart}
                    selectedCategory={selectedCategory}
                  />
                </>
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
          openPayment={() => setShowPayment(true)}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          couponApplied={couponApplied}
          couponMessage={couponMessage}
          handleApplyCoupon={handleApplyCoupon}
          handleRemoveCoupon={handleRemoveCoupon}
          couponDiscount={couponDiscount}
          deliveryFee={DELIVERY_FEE}
          finalTotal={finalTotal}
        />

        {showPayment && (
          <PaymentModal
            totalAmount={finalTotal}
            subtotal={totalAmount}
            couponDiscount={couponDiscount}
            deliveryFee={DELIVERY_FEE}
            closePayment={() => setShowPayment(false)}
            cart={cart}
            setCart={setCart}
          />
        )}
        <Footer
  openAbout={() => setShowAbout(true)}
  openContact={() => setShowContact(true)}
/>

      </div>
    </div>
    {toast && (
      <div className="fixed bottom-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white
      px-6 py-3 rounded-lg shadow-lg animate-bounce z-50 animate-slideIn">
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
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">Admin Required</p>
        <h2 className="text-4xl font-bold mb-4">Access Denied</h2>
        <p className="text-slate-400 mb-8">
          You must be logged in as an admin to view this page. Please sign in with an admin account.
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

function MenuModal({ close, setCategory }) {
  const categories = ["All", "Veg", "Non-Veg", "Starter", "Non-Veg Starter", "Bread"];

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 text-center">

        <h2 className="text-xl font-bold mb-4">Menu Categories</h2>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              close();
            }}
            className="block w-full mb-2 bg-gray-100 hover:bg-yellow-400 py-2 rounded"
          >
            {cat}
          </button>
        ))}

        <button onClick={close} className="mt-4 text-red-500">Close</button>
      </div>
    </div>
  );
}

function ProfileModal({ user, close, openOrders, onLogout, onDeleteAccount }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-slate-950 text-white p-6 rounded-[2rem] w-full max-w-sm border border-slate-800 shadow-2xl shadow-black/40">

        <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>

        <p className="text-slate-300"><b>Name:</b> {user.name}</p>
        <p className="text-slate-300 mb-4"><b>Email:</b> {user.email}</p>

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
  isLoggedIn,
  onLogout
}) {
  return (
    <nav className="bg-gradient-to-r from-slate-900 to-black text-white px-6 py-4 flex justify-between items-center shadow-xl border-b border-orange-500/20">

      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold tracking-wider bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent hover:opacity-90 transition"
      >
        Tandoori Tales 🔥
      </Link>

      <div className="flex items-center gap-4">

        {isAdmin && (
          <Link
            to="/admin"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 text-sm font-semibold text-slate-100 hover:bg-slate-700 transition"
          >
            🛠️ Admin Panel
          </Link>
        )}

        {/* Profile */}
        {user ? (
          <button
            onClick={openProfile}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <span className="text-lg">👤</span>
            <span className="hidden sm:inline font-medium">{user.name}</span>
          </button>
        ) : (
          <>
            <button
              onClick={openRegister}
              className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
            >
              Register
            </button>
            <button
              onClick={openLogin}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition"
            >
              Login
            </button>
          </>
        )}

        {/* Cart */}
        <button
          onClick={openCart}
          className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-orange-500/50 hover:opacity-95 transition"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-yellow-400 text-slate-900 text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
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

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden">

      {/* Background Image + Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-white px-6">

        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Tandoori Tales 
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-6">
          Where Every Bite Tells a Story 🍽️
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/menu")}
            className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition duration-300 shadow-lg"
          >
            🔍 View Dishes
          </button>
        </div>

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
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200/50" : "bg-white text-slate-700 border border-slate-300 hover:border-orange-400 hover:text-orange-600 shadow-sm"}`}
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
      : foodItems.filter(
          (item) => item.category === selectedCategory
        );

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
          🛒 Add to Cart
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
  couponMessage,
  handleApplyCoupon,
  handleRemoveCoupon,
  couponDiscount,
  deliveryFee,
  finalTotal,
}) {
  const gstAmount = totalAmount * 0.05;
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
                  >
                    −
                  </button>
                  <span className="px-2 font-semibold text-slate-900 text-sm min-w-[1.5rem] text-center">{item.quantity}</span>
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

    {/* INPUT */}
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

    {/* MESSAGE */}
    {couponMessage && (
      <p
        className={`text-sm ${
          couponApplied ? "text-green-600" : "text-red-600"
        }`}
      >
        {couponMessage}
      </p>
    )}

    {/* 🔥 AVAILABLE COUPON BOX */}
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
            <span className="font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="font-semibold">Coupon Discount</span>
              <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">GST (5%)</span>
            <span className="font-bold text-orange-600">₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Delivery</span>
            <span className="font-bold text-slate-900">₹{deliveryFee.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ₹{finalTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
          
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Tandoori Tales 
            </h3>
            <p className="text-slate-400 text-sm">Where Every Bite Tells a Story</p>
          </div>

          {/* Links */}
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

          {/* Social */}
          <div className="text-right">
            <p className="text-slate-400 text-sm mb-2">Follow Us</p>
            <div className="flex justify-end gap-2">
              {['f', '📷', '𝕏', '▶'].map((icon, i) => (
                <button
                  key={i}
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
function PaymentModal({ totalAmount, subtotal, couponDiscount, deliveryFee, closePayment, cart, setCart }) {
  const [paymentMethod, setPaymentMethod] = useState("Netbanking");
  const [nbEmail, setNbEmail] = useState("");
  const [nbPassword, setNbPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [upiId, setUpiId] = useState("");

  const handlePayment = () => {
  if (!cart || cart.length === 0) {
    alert("🛒 Your cart is empty!");
    return;
  }

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("Please login first!");
    return;
  }

  // validation same as before
  if (paymentMethod === "Netbanking" && (!nbEmail || !nbPassword)) {
    alert("Please enter Net Banking credentials");
    return;
  }

  if (paymentMethod === "Card" && (!cardNumber || !cardHolder || !cvv || !expiry)) {
    alert("Please enter all card details");
    return;
  }

  if (paymentMethod === "UPI" && !upiId) {
    alert("Please enter UPI ID");
    return;
  }

  try {
    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: totalAmount,
      user_id: user.id,
      payment_method: paymentMethod,
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, newOrder])
    );

    alert(`✅ Order placed successfully with ${paymentMethod}!`);

    setCart([]);
    closePayment();

  } catch (error) {
    console.error(error);
    alert("❌ Failed to save order");
  }
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
          {/* LEFT SIDE - PAYMENT FORM */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-8 md:border-r border-slate-200">
            <h2 className="text-2xl font-bold mb-6">Your Payment Details</h2>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Select Payment Method</label>
              <div className="grid gap-2">
                {[
                  { key: "Netbanking", label: "🏦 Net Banking" },
                  { key: "Card", label: "💳 Debit/Credit Card" },
                  { key: "UPI", label: "📱 UPI" },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setPaymentMethod(option.key)}
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

            {/* NET BANKING FORM */}
            {paymentMethod === "Netbanking" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-orange-300 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">Enter your Net Banking credentials</p>
                <div>
                  <label className="block text-sm font-semibold mb-2">Bank Email / User ID</label>
                  <input
                    type="text"
                    placeholder="youremail@bank.com"
                    value={nbEmail}
                    onChange={(e) => setNbEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
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

            {/* CARD FORM */}
            {paymentMethod === "Card" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-blue-300 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">Enter your card details securely</p>
                <div>
                  <label className="block text-sm font-semibold mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                    maxLength="16"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
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
                    <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength="5"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="3"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI FORM */}
            {paymentMethod === "UPI" && (
              <div className="space-y-4 p-4 bg-white border-2 border-dashed border-purple-300 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">Scan QR code or enter UPI ID</p>
                <div className="flex justify-center mb-4">
                  <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={upiQRCode} 
                      alt="UPI QR Code" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Or Enter UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - ORDER SUMMARY */}
          <div className="bg-white p-8">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-slate-600">×{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span>₹{((subtotal - couponDiscount) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>₹{deliveryFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-slate-700">Total Amount (Including GST + Delivery)</span>
                <span className="text-2xl font-bold text-orange-600">₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>

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
