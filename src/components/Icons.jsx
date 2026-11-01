const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const CartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L20.5 8H6" />
    <circle cx="9.5" cy="20" r="1" />
    <circle cx="17" cy="20" r="1" />
  </svg>
);
export const UserIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const TrashIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

/* Indian food-labelling mark: green = vegetarian, red = non-vegetarian */
export function DietMark({ veg }) {
  const color = veg ? "#1f8a4c" : "#c23b22";
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] bg-white"
      style={{ borderColor: color }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
    </span>
  );
}
