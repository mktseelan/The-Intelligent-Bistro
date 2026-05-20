export type MenuItem = {
  id: string;
  name: string;
  price: number;
  aliases: string[];
};

export const menuItems: MenuItem[] = [
  {
    id: "spicy-chicken-sandwich",
    name: "Spicy Chicken Sandwich",
    price: 14,
    aliases: ["spicy chicken sandwich", "spicy chicken sandwiches", "chicken sandwich"],
  },
  {
    id: "classic-cheeseburger",
    name: "Classic Cheeseburger",
    price: 15,
    aliases: ["classic cheeseburger", "classic cheeseburgers", "burger", "burgers", "cheeseburger"],
  },
  {
    id: "truffle-fries",
    name: "Truffle Fries",
    price: 8,
    aliases: ["truffle fries", "fries"],
  },
  {
    id: "caesar-bowl",
    name: "Caesar Bowl",
    price: 13,
    aliases: ["caesar bowl", "caesar"],
  },
  {
    id: "grilled-salmon-bowl",
    name: "Grilled Salmon Bowl",
    price: 19,
    aliases: ["grilled salmon bowl", "salmon bowl", "salmon"],
  },
  {
    id: "large-water",
    name: "Large Water",
    price: 3,
    aliases: ["large water", "water bottle", "water bottles", "water"],
  },
  {
    id: "iced-tea",
    name: "Iced Tea",
    price: 4,
    aliases: ["iced tea", "tea"],
  },
  {
    id: "chocolate-lava-cake",
    name: "Chocolate Lava Cake",
    price: 9,
    aliases: ["chocolate lava cake", "lava cake", "cake"],
  },
];

export const menuItemsById = new Map(menuItems.map((item) => [item.id, item]));
