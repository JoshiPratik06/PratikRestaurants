import vegItems from "./veg";
import nonVegItems from "./nonVeg";
import starterItems from "./starter";
import nonvegstarterItems from "./nonvegstarter";

const foodItems = [
  ...vegItems,
  ...nonVegItems,
  ...starterItems,
  ...nonvegstarterItems,

];

export default foodItems;