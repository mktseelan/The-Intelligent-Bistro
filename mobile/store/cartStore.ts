import { create } from "zustand";
import { menuItems } from "../data/menu";
import type {
  AIAction,
  CartAddItemInput,
  CartItem,
  CartItemReference,
  MenuSection,
} from "../types";

type CartStore = {
  items: CartItem[];
  selectedSection: MenuSection;
  setSelectedSection: (section: MenuSection) => void;
  addItem: (item: CartAddItemInput, quantity?: number, modifiers?: string[]) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (item: string | CartItemReference) => void;
  clearCart: () => void;
  applyAIActions: (actions: AIAction[]) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
};

const normalizedMenuItems = menuItems.map((item) => ({
  ...item,
  normalizedName: item.name.trim().toLowerCase(),
}));

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

function resolveMenuItem(reference: CartItemReference) {
  if (reference.itemId) {
    const exactById = menuItems.find((item) => item.itemId === reference.itemId);

    if (exactById) {
      return exactById;
    }
  }

  if (!reference.name) {
    return null;
  }

  const normalizedName = normalizeName(reference.name);
  return normalizedMenuItems.find((item) => item.normalizedName === normalizedName) ?? null;
}

function sameModifiers(left: string[], right: string[]) {
  return left.join("|") === right.join("|");
}

function resolveCartItem(items: CartItem[], reference: string | CartItemReference) {
  if (typeof reference === "string") {
    return items.find((item) => item.itemId === reference) ?? null;
  }

  if (reference.itemId) {
    const matchById = items.find((item) => item.itemId === reference.itemId);

    if (matchById) {
      return matchById;
    }
  }

  if (!reference.name) {
    return null;
  }

  const normalizedName = normalizeName(reference.name);
  return items.find((item) => normalizeName(item.name) === normalizedName) ?? null;
}

function mergeCartItem(
  items: CartItem[],
  item: CartAddItemInput,
  quantity: number,
  modifiers: string[] = [],
) {
  const resolvedMenuItem = resolveMenuItem(item);
  const itemId = item.itemId ?? resolvedMenuItem?.itemId;
  const name = item.name ?? resolvedMenuItem?.name;
  const price = item.price ?? resolvedMenuItem?.price;

  if (!itemId || !name || typeof price !== "number") {
    return items;
  }

  const existing = items.find(
    (entry) => entry.itemId === itemId && sameModifiers(entry.modifiers, modifiers),
  );

  if (!existing) {
    return [
      ...items,
      {
        itemId,
        name,
        price,
        quantity,
        modifiers,
      },
    ];
  }

  return items.map((entry) =>
    entry.itemId === itemId && sameModifiers(entry.modifiers, modifiers)
      ? { ...entry, quantity: entry.quantity + quantity }
      : entry,
  );
}

function removeCartItem(items: CartItem[], reference: string | CartItemReference) {
  const resolvedItem = resolveCartItem(items, reference);

  if (!resolvedItem) {
    return items;
  }

  return items.filter((item) => item.itemId !== resolvedItem.itemId);
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
    return removeCartItem(items, {
      itemId: action.itemId,
      name: action.name,
    });
  }

  if (action.type === "UPDATE_QUANTITY") {
    return setItemQuantity(items, action.itemId, action.quantity);
  }

  return mergeCartItem(items, action, action.quantity, action.modifiers ?? []);
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  selectedSection: "Popular",
  setSelectedSection: (selectedSection) => set({ selectedSection }),
  addItem: (item, quantity = 1, modifiers = []) =>
    set((state) => ({
      items: mergeCartItem(state.items, item, quantity, modifiers),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: setItemQuantity(state.items, itemId, quantity),
    })),
  removeItem: (item) =>
    set((state) => ({
      items: removeCartItem(state.items, item),
    })),
  clearCart: () => set({ items: [] }),
  applyAIActions: (actions) =>
    set((state) => ({
      items: actions.reduce(reduceAction, state.items),
    })),
  getCartTotal: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getCartCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
