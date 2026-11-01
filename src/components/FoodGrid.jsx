import FoodCard from "./FoodCard";
import foodItems from "../data";

export default function FoodGrid({ addToCart, selectedCategory }) {
  const filteredItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="mb-5 text-sm text-[#6b7468]">
        {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"}
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <FoodCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
