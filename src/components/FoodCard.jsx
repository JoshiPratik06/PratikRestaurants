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
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{item.name}</h3>
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

export default FoodCard;