import { create } from "zustand";
import { menuItems } from "../data/menu";
import type { AIAction, CartItem, MenuItem, MenuSection } from "../types";

type CartStore = {
  items: CartItem[];
  selectedSection: MenuSection;
  setSelectedSection: (section: MenuSection) => void;
  addItem: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyAIActions: (actions: AIAction[]) => void;
};

function mergeCartItem(items: CartItem[], item: MenuItem, quantity: number, modifiers: string[] = []) {
  const existing = items.find(
    (entry) => entry.itemId === item.itemId && entry.modifiers.join("|") === modifiers.join("|"),
  );

  if (!existing) {
    return [
      ...items,
      {
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity,
        modifiers,
      },
    ];
  }

  return items.map((entry) =>
    entry.itemId === item.itemId && entry.modifiers.join("|") === modifiers.join("|")
      ? { ...entry, quantity: entry.quantity + quantity }
      : entry,
  );
}

function setItemQuantity(items: CartItem[], itemId: string, quantity: number) {
  if (quantity <= 0) {
    return items.filter((item) => item.itemId !== itemId);
  }

  return items.map((item) => (item.itemId === itemId ? { ...item, quantity } : item));
}

function reduceAction(items: CartItem[], action: AIAction) {
  if (action.type === "CLEAR_CART") {
    return [];
  }

  if (action.type === "REMOVE_ITEM") {
    return items.filter((item) => item.itemId !== action.itemId);
  }

  if (action.type === "UPDATE_QUANTITY") {
    return setItemQuantity(items, action.itemId, action.quantity);
  }

  const menuItem = menuItems.find((item) => item.itemId === action.itemId);

  if (!menuItem) {
    return items;
  }

  return mergeCartItem(items, menuItem, action.quantity, action.modifiers);
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  selectedSection: "Popular",
  setSelectedSection: (selectedSection) => set({ selectedSection }),
  addItem: (item, quantity = 1) =>
    set((state) => ({
      items: mergeCartItem(state.items, item, quantity),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: setItemQuantity(state.items, itemId, quantity),
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.itemId !== itemId),
    })),
  clearCart: () => set({ items: [] }),
  applyAIActions: (actions) =>
    set((state) => ({
      items: actions.reduce(reduceAction, state.items),
    })),
}));

