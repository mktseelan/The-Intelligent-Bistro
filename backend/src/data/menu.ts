export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Starters" | "Mains" | "Desserts" | "Drinks";
  aliases: string[];
};

export const menu: MenuItem[] = [
  {
    id: "truffle-fries",
    name: "Truffle Fries",
    description: "Crisp fries, parmesan, parsley, white truffle oil.",
    price: 9,
    category: "Starters",
    aliases: ["truffle fries", "fries"],
  },
  {
    id: "burrata-salad",
    name: "Burrata Salad",
    description: "Heirloom tomatoes, basil, burrata, aged balsamic.",
    price: 14,
    category: "Starters",
    aliases: ["burrata salad", "burrata", "salad"],
  },
  {
    id: "smash-burger",
    name: "Signature Smash Burger",
    description: "Double patty, cheddar, caramelized onion, aioli.",
    price: 18,
    category: "Mains",
    aliases: ["smash burger", "burger", "signature burger"],
  },
  {
    id: "spicy-rigatoni",
    name: "Spicy Rigatoni",
    description: "Creamy tomato vodka sauce with chili breadcrumbs.",
    price: 19,
    category: "Mains",
    aliases: ["spicy rigatoni", "rigatoni", "pasta"],
  },
  {
    id: "miso-salmon",
    name: "Miso Glazed Salmon",
    description: "Roasted salmon, jasmine rice, charred broccolini.",
    price: 24,
    category: "Mains",
    aliases: ["miso salmon", "salmon"],
  },
  {
    id: "chocolate-torte",
    name: "Chocolate Torte",
    description: "Dark chocolate torte with whipped creme fraiche.",
    price: 11,
    category: "Desserts",
    aliases: ["chocolate torte", "torte", "dessert"],
  },
  {
    id: "yuzu-spritz",
    name: "Yuzu Spritz",
    description: "Sparkling citrus mocktail with fresh mint.",
    price: 7,
    category: "Drinks",
    aliases: ["yuzu spritz", "spritz", "drink"],
  },
];

export const menuById = new Map(menu.map((item) => [item.id, item]));

