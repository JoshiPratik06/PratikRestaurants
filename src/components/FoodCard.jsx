import { DietMark, PlusIcon } from "./Icons";

export default function FoodCard({ item, addToCart }) {
  const isVeg = item.category === "Veg" || item.category === "Starter" || item.category === "Bread";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#e3e1d6] bg-white">
      <div className="aspect-[4/3] overflow-hidden bg-[#e3e1d6]">
        <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2">
          <span className="mt-1"><DietMark veg={isVeg} /></span>
          <h3 className="font-display text-lg font-bold leading-snug line-clamp-2">{item.name}</h3>
        </div>
        <p className="mt-1 text-sm text-[#6b7468]">{item.category}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-lg font-bold">₹{item.price}</p>
          <button
            onClick={() => addToCart(item)}
            aria-label={`Add ${item.name} to cart`}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#17251d] px-3.5 py-2 text-sm font-bold transition-colors hover:bg-[#17251d] hover:text-white active:scale-95"
          >
            <PlusIcon width={16} height={16} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
