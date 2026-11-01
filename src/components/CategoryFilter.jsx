const categories = ["All", "Veg", "Non-Veg", "Starter", "Non-Veg Starter", "Bread"];

export default function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="sticky top-[57px] z-20 border-b border-[#e3e1d6] bg-[#f6f5ef]/95 backdrop-blur">
      <div
        role="tablist"
        aria-label="Menu categories"
        className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 sm:px-6"
      >
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 border-b-2 py-4 text-sm font-semibold transition-colors ${
                active
                  ? "border-[#17251d] text-[#17251d]"
                  : "border-transparent text-[#6b7468] hover:text-[#17251d]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
