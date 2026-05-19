export type MenuCategory = "All" | "Starters" | "Mains" | "Desserts" | "Drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<MenuCategory, "All">;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type AIAction =
  | {
      type: "add_item";
      itemId: string;
      quantity: number;
    }
  | {
      type: "update_quantity";
      itemId: string;
      quantity: number;
    }
  | {
      type: "remove_item";
      itemId: string;
    }
  | {
      type: "clear_cart";
    };

export type AIOrderResponse = {
  reply: string;
  actions: AIAction[];
  source: "openai" | "fallback";
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  source?: AIOrderResponse["source"];
};

