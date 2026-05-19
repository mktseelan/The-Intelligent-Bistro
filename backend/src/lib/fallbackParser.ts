import { menu } from "../data/menu.js";
import type { AIAction, AIOrderResponse, CartItem, OrderRequest } from "../types/order.js";

const numberWords: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

const removeWords = ["remove", "delete", "take off", "without"];
const updateWords = ["set", "make", "change", "update"];
const clearWords = ["clear cart", "empty cart", "start over"];

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function isExistingCartItem(cart: CartItem[], itemId: string) {
  return cart.some((item) => item.id === itemId);
}

function extractQuantity(message: string, alias: string) {
  const quantityPattern = new RegExp(`(\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten)\\s+${alias.replace(/\s+/g, "\\s+")}`);
  const quantityMatch = message.match(quantityPattern);

  if (quantityMatch) {
    const rawQuantity = quantityMatch[1];
    return Number(rawQuantity) || numberWords[rawQuantity] || 1;
  }

  if (message.includes(`another ${alias}`) || message.includes(`add ${alias}`)) {
    return 1;
  }

  return 1;
}

function buildReply(actions: AIAction[]) {
  if (actions.length === 0) {
    return "I couldn't confidently map that to the menu. Try mentioning an item like burger, salmon, or truffle fries.";
  }

  return actions
    .map((action) => {
      if (action.type === "clear_cart") {
        return "Cleared the cart.";
      }

      const item = menu.find((entry) => entry.id === action.itemId);
      const itemName = item?.name ?? action.itemId;

      if (action.type === "remove_item") {
        return `Removed ${itemName}.`;
      }

      if (action.type === "update_quantity") {
        return action.quantity === 0
          ? `Removed ${itemName}.`
          : `Updated ${itemName} to ${action.quantity}.`;
      }

      return `Added ${action.quantity} ${itemName}.`;
    })
    .join(" ");
}

export function parseOrderFallback({ message, cart }: OrderRequest): AIOrderResponse {
  const normalizedMessage = normalize(message);
  const actions: AIAction[] = [];

  if (clearWords.some((phrase) => normalizedMessage.includes(phrase))) {
    return {
      reply: "Cleared the cart and reset the order.",
      actions: [{ type: "clear_cart" }],
      source: "fallback",
    };
  }

  for (const item of menu) {
    const matchedAlias = item.aliases.find((alias) => normalizedMessage.includes(alias));

    if (!matchedAlias) {
      continue;
    }

    const quantity = extractQuantity(normalizedMessage, matchedAlias);
    const wantsRemoval = removeWords.some((word) => normalizedMessage.includes(word));
    const wantsUpdate = updateWords.some((word) => normalizedMessage.includes(word));

    if (wantsRemoval) {
      actions.push({ type: "remove_item", itemId: item.id });
      continue;
    }

    if (wantsUpdate && isExistingCartItem(cart, item.id)) {
      actions.push({
        type: "update_quantity",
        itemId: item.id,
        quantity,
      });
      continue;
    }

    actions.push({
      type: "add_item",
      itemId: item.id,
      quantity,
    });
  }

  return {
    reply: buildReply(actions),
    actions,
    source: "fallback",
  };
}

