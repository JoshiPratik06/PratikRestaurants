import FoodCard from './FoodCard';
import foodItems from '../data';

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

export default FoodGrid;