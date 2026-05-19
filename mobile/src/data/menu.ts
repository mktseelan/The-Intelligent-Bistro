import type { MenuCategory, MenuItem } from "../types";

export const menuCategories: MenuCategory[] = ["All", "Starters", "Mains", "Desserts", "Drinks"];

export const menu: MenuItem[] = [
  {
    id: "truffle-fries",
    name: "Truffle Fries",
    description: "Parmesan, parsley, and a finish of white truffle oil.",
    price: 9,
    category: "Starters",
  },
  {
    id: "burrata-salad",
    name: "Burrata Salad",
    description: "Heirloom tomatoes, basil, burrata, and aged balsamic.",
    price: 14,
    category: "Starters",
  },
  {
    id: "smash-burger",
    name: "Signature Smash Burger",
    description: "Double patties, cheddar, caramelized onion, and aioli.",
    price: 18,
    category: "Mains",
  },
  {
    id: "spicy-rigatoni",
    name: "Spicy Rigatoni",
    description: "Creamy tomato vodka sauce with chili breadcrumbs.",
    price: 19,
    category: "Mains",
  },
  {
    id: "miso-salmon",
    name: "Miso Glazed Salmon",
    description: "Roasted salmon with jasmine rice and broccolini.",
    price: 24,
    category: "Mains",
  },
  {
    id: "chocolate-torte",
    name: "Chocolate Torte",
    description: "Dark chocolate torte with whipped creme fraiche.",
    price: 11,
    category: "Desserts",
  },
  {
    id: "yuzu-spritz",
    name: "Yuzu Spritz",
    description: "Sparkling citrus mocktail with fresh mint.",
    price: 7,
    category: "Drinks",
  },
];

