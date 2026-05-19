import { create } from "zustand";
import { menu } from "../data/menu";
import type { AIAction, CartItem, MenuCategory, MenuItem } from "../types";

type CartState = {
  items: CartItem[];
  selectedCategory: MenuCategory;
  setSelectedCategory: (category: MenuCategory) => void;
  addItem: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  applyAIActions: (actions: AIAction[]) => void;
};

function upsertItem(items: CartItem[], item: MenuItem, quantity: number) {
  const existingItem = items.find((entry) => entry.id === item.id);

  if (!existingItem) {
    return [...items, { ...item, quantity }];
  }

  return items.map((entry) =>
    entry.id === item.id ? { ...entry, quantity: entry.quantity + quantity } : entry,
  );
}

function setQuantity(items: CartItem[], itemId: string, quantity: number) {
  if (quantity <= 0) {
    return items.filter((item) => item.id !== itemId);
  }

  return items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
}

function applyAction(items: CartItem[], action: AIAction) {
  if (action.type === "clear_cart") {
    return [];
  }

  if (action.type === "remove_item") {
    return items.filter((item) => item.id !== action.itemId);
  }

  if (action.type === "update_quantity") {
    return setQuantity(items, action.itemId, action.quantity);
  }

  const menuItem = menu.find((item) => item.id === action.itemId);

  if (!menuItem) {
    return items;
  }

  return upsertItem(items, menuItem, action.quantity);
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  selectedCategory: "All",
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  addItem: (item, quantity = 1) =>
    set((state) => ({
      items: upsertItem(state.items, item, quantity),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: setQuantity(state.items, itemId, quantity),
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  clearCart: () => set({ items: [] }),
  applyAIActions: (actions) =>
    set((state) => ({
      items: actions.reduce(applyAction, state.items),
    })),
}));

