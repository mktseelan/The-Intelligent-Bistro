import type { MenuItem, MenuSection } from "../types";

export const menuSections: MenuSection[] = [
  "Popular",
  "Burgers",
  "Bowls",
  "Sides",
  "Drinks",
  "Desserts",
];

export const menuItems: MenuItem[] = [
  {
    itemId: "spicy-chicken-sandwich",
    name: "Spicy Chicken Sandwich",
    description: "Crisp chicken, hot honey slaw, and pickled shallots on a toasted brioche bun.",
    detail: "Best with truffle fries",
    price: 14,
    category: "Burgers",
    isPopular: true,
    tintClass: "bg-[#F2D7CE]",
  },
  {
    itemId: "classic-cheeseburger",
    name: "Classic Cheeseburger",
    description: "Double smash patties, aged cheddar, onion jam, and house sauce.",
    detail: "Guest favorite",
    price: 15,
    category: "Burgers",
    isPopular: true,
    tintClass: "bg-[#E4DCCB]",
  },
  {
    itemId: "truffle-fries",
    name: "Truffle Fries",
    description: "Golden fries with parmesan, cracked pepper, and white truffle oil.",
    detail: "Shareable side",
    price: 8,
    category: "Sides",
    isPopular: true,
    tintClass: "bg-[#E8E0CE]",
  },
  {
    itemId: "caesar-bowl",
    name: "Caesar Bowl",
    description: "Little gem lettuce, sourdough crumbs, shaved parmesan, and lemon caesar dressing.",
    detail: "Bright and savory",
    price: 13,
    category: "Bowls",
    isPopular: false,
    tintClass: "bg-[#DCE6D2]",
  },
  {
    itemId: "grilled-salmon-bowl",
    name: "Grilled Salmon Bowl",
    description: "Herb rice, charred vegetables, avocado, and miso citrus glaze.",
    detail: "Balanced and satisfying",
    price: 19,
    category: "Bowls",
    isPopular: true,
    tintClass: "bg-[#D7E4E5]",
  },
  {
    itemId: "large-water",
    name: "Large Water",
    description: "Chilled still water served tableside in a generous glass pour.",
    detail: "Hydration, elevated",
    price: 3,
    category: "Drinks",
    isPopular: false,
    tintClass: "bg-[#D8E8F4]",
  },
  {
    itemId: "iced-tea",
    name: "Iced Tea",
    description: "Cold brewed black tea with citrus peel and just a touch of cane.",
    detail: "Crisp finish",
    price: 4,
    category: "Drinks",
    isPopular: false,
    tintClass: "bg-[#ECE0D1]",
  },
  {
    itemId: "chocolate-lava-cake",
    name: "Chocolate Lava Cake",
    description: "Warm dark chocolate center with vanilla bean whipped cream.",
    detail: "Rich dessert finish",
    price: 9,
    category: "Desserts",
    isPopular: true,
    tintClass: "bg-[#EBD6D8]",
  },
];

const popularItemIds = [
  "spicy-chicken-sandwich",
  "classic-cheeseburger",
  "truffle-fries",
  "grilled-salmon-bowl",
  "chocolate-lava-cake",
] as const;

export const popularMenuItems = popularItemIds
  .map((itemId) => menuItems.find((item) => item.itemId === itemId))
  .filter((item): item is MenuItem => Boolean(item));
