import vegItems from "./veg";
import nonVegItems from "./nonVeg";
import starterItems from "./starter";
import nonvegstarterItems from "./nonvegstarter";
import breadItems from "./bread";

const foodItems = [
  ...vegItems,
  ...nonVegItems,
  ...starterItems,
  ...nonvegstarterItems,
  ...breadItems,
];

export default foodItems;