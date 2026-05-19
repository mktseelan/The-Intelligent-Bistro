export type MenuSection = "Popular" | "Burgers" | "Bowls" | "Sides" | "Drinks" | "Desserts";

export type MenuItem = {
  itemId: string;
  name: string;
  description: string;
  detail: string;
  price: number;
  category: Exclude<MenuSection, "Popular">;
  isPopular: boolean;
  tintClass: string;
};

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
};

export type AIAction =
  | {
      type: "ADD_ITEM";
      itemId: string;
      quantity: number;
      modifiers: string[];
    }
  | {
      type: "REMOVE_ITEM";
      itemId: string;
    }
  | {
      type: "UPDATE_QUANTITY";
      itemId: string;
      quantity: number;
    }
  | {
      type: "CLEAR_CART";
    };

export type OrderResponse = {
  message: string;
  actions: AIAction[];
};

export type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

