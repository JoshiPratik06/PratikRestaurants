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

export default CategoryFilter;