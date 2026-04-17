import { useState, useEffect } from "react";
import foodItems from "./data";

export default function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
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

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 relative">

        <Navbar
          cartCount={cart.length}
          openCart={() => setIsCartOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <Hero />

        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <FoodGrid
          addToCart={addToCart}
          selectedCategory={selectedCategory}
        />

        {isCartOpen && (
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          ></div>
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
        />

        {showPayment && (
          <PaymentModal
            totalAmount={totalAmount}
            closePayment={() => setShowPayment(false)}
          />
        )}
      </div>
    </div>
  );
}

function Navbar({ cartCount, openCart, darkMode, setDarkMode }) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center transition-colors duration-300">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        Pratik's Restaurant
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded border dark:text-white"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={openCart}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cart ({cartCount})
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <div className="text-center mt-10">
      <h2 className="text-4xl font-bold dark:text-white">
        Delicious Food, Delivered Fast 🍔
      </h2>
    </div>
  );
}

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const categories = ["All", "Veg", "Non-Veg", "Starter"];

  return (
    <div className="flex justify-center gap-4 mt-6 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
            selectedCategory === category
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white dark:bg-gray-700 dark:text-white shadow hover:bg-red-500 hover:text-white"
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-lg font-semibold dark:text-white">
          {item.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          ₹{item.price}
        </p>

        <button
          onClick={() => addToCart(item)}
          className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full w-full hover:opacity-90 transition"
        >
          Add to Cart
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
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-all duration-500 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex justify-between items-center border-b dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">🛒 Your Cart</h2>
        <button onClick={closeCart} className="dark:text-white">
          ✕
        </button>
      </div>

      <div className="p-6 overflow-y-auto h-[65%]">
        {cart.length === 0 ? (
          <p className="dark:text-white">No items added</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="mb-4 border-b pb-2 dark:border-gray-700">
              <h4 className="font-semibold dark:text-white">{item.name}</h4>
              <p className="dark:text-gray-300">₹{item.price}</p>

              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => decreaseQty(item.id)} className="px-2 bg-gray-300 rounded">-</button>
                <span className="dark:text-white">{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)} className="px-2 bg-gray-300 rounded">+</button>
                <button onClick={() => removeItem(item.id)} className="px-3 bg-red-500 text-white rounded">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t dark:border-gray-700">
        <h3 className="text-lg font-bold dark:text-white">
          Total: ₹{totalAmount}
        </h3>

        <button
          onClick={openPayment}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

function PaymentModal({ totalAmount, closePayment }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Payment
        </h2>
        <p className="mb-4 font-semibold dark:text-gray-300">
          Total: ₹{totalAmount}
        </p>

        <button
          onClick={closePayment}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}