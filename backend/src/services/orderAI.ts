import OpenAI from "openai";
import { menuItems, menuItemsById } from "../menu.js";
import {
  orderResponseSchema,
  type AIAction,
  type CartItem,
  type OrderRequest,
  type OrderResponse,
} from "../schemas/orderSchema.js";

let cachedOpenAIClient: OpenAI | null | undefined;
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

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

function toCount(raw: string | undefined) {
  if (!raw) {
    return 1;
  }

  const numericValue = Number(raw);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : (numberWords[raw] ?? 1);
}

function buildReply(actions: AIAction[]) {
  if (actions.length === 0) {
    return "I couldn't confidently update the cart from that request.";
  }

  return actions
    .map((action) => {
      if (action.type === "CLEAR_CART") {
        return "Cleared your cart.";
      }

      const item = menuItemsById.get(action.itemId);
      const itemName = item?.name ?? action.itemId;

      if (action.type === "REMOVE_ITEM") {
        return `Removed ${itemName}.`;
      }

      if (action.type === "UPDATE_QUANTITY") {
        return action.quantity === 0
          ? `Removed ${itemName}.`
          : `Set ${itemName} quantity to ${action.quantity}.`;
      }

      return `Added ${action.quantity} ${itemName}.`;
    })
    .join(" ");
}

function extractAddQuantity(message: string, alias: string) {
  const escapedAlias = alias.replace(/\s+/g, "\\s+");
  const match = message.match(
    new RegExp(`(\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten)\\s+${escapedAlias}`),
  );

  return toCount(match?.[1]);
}

function extractUpdateQuantity(message: string, alias: string) {
  const escapedAlias = alias.replace(/\s+/g, "\\s+");
  const patterns = [
    new RegExp(`${escapedAlias}\\s+(?:quantity\\s+)?(?:to\\s+)?(\\d+)`),
    new RegExp(`(?:make|set|change|update)\\s+${escapedAlias}\\s+(?:quantity\\s+)?(?:to\\s+)?(\\d+)`),
    new RegExp(`(?:make|set|change|update)\\s+${escapedAlias}\\s+quantity\\s+(\\d+)`),
    new RegExp(`(?:make|set|change|update)\\s+quantity\\s+of\\s+${escapedAlias}\\s+(?:to\\s+)?(\\d+)`),
    new RegExp(`(?:make|set|change|update)\\s+the\\s+quantity\\s+of\\s+${escapedAlias}\\s+(?:to\\s+)?(\\d+)`),
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
}

function findMenuMatches(message: string) {
  return menuItems.flatMap((item) => {
    const alias = item.aliases.find((candidate) => message.includes(candidate));
    return alias ? [{ item, alias }] : [];
  });
}

function parseFallbackOrder({ message }: OrderRequest): OrderResponse {
  const normalizedMessage = normalize(message);
  const matches = findMenuMatches(normalizedMessage);
  const actions: AIAction[] = [];

  if (/(clear|empty|reset).*(cart|order)|clear my cart|clear cart/.test(normalizedMessage)) {
    return {
      message: "Cleared your cart.",
      actions: [{ type: "CLEAR_CART" }],
    };
  }

  for (const { item, alias } of matches) {
    if (/(remove|delete|take off|take out)/.test(normalizedMessage)) {
      actions.push({
        type: "REMOVE_ITEM",
        itemId: item.id,
      });
      continue;
    }

    if (/(make|set|change|update)/.test(normalizedMessage)) {
      const quantity = extractUpdateQuantity(normalizedMessage, alias);

      if (quantity !== null) {
        actions.push({
          type: "UPDATE_QUANTITY",
          itemId: item.id,
          quantity,
        });
        continue;
      }
    }

    actions.push({
      type: "ADD_ITEM",
      itemId: item.id,
      quantity: extractAddQuantity(normalizedMessage, alias),
      modifiers: [],
    });
  }

  return {
    message: buildReply(actions),
    actions,
  };
}

function shouldUseFallbackFirst(response: OrderResponse) {
  return response.actions.length > 0;
}

function getOpenAIModel() {
  return process.env.OPENAI_MODEL || "gpt-4.1-nano";
}

function getOpenAIClient() {
  if (cachedOpenAIClient !== undefined) {
    return cachedOpenAIClient;
  }

  cachedOpenAIClient = process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    : null;

  return cachedOpenAIClient;
}

function buildPrompt(payload: OrderRequest) {
  const menuContext = menuItems.map(({ id, name, aliases }) => ({
    id,
    name,
    aliases,
  }));

  return [
    "You convert restaurant ordering chat into structured cart actions.",
    "Return JSON only. No markdown, no explanation.",
    "The JSON must match this shape exactly:",
    JSON.stringify({
      message: "Short friendly summary of the cart update.",
      actions: [
        {
          type: "ADD_ITEM",
          itemId: "menu-item-id",
          quantity: 1,
          modifiers: [],
        },
      ],
    }),
    "Allowed action types: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART.",
    "For REMOVE_ITEM, use { type, itemId }.",
    "For UPDATE_QUANTITY, use { type, itemId, quantity }.",
    "For CLEAR_CART, use { type }.",
    "Use only these menu items and IDs:",
    JSON.stringify(menuContext),
    "Current cart:",
    JSON.stringify(payload.cart),
    "User message:",
    payload.message,
  ].join("\n");
}

async function parseWithOpenAI(payload: OrderRequest): Promise<OrderResponse | null> {
  const openAIClient = getOpenAIClient();

  if (!openAIClient) {
    return null;
  }

  const response = await openAIClient.responses.create({
    model: getOpenAIModel(),
    input: buildPrompt(payload),
  });

  const parsedText = response.output_text?.trim();

  if (!parsedText) {
    throw new Error("OpenAI returned an empty response.");
  }

  return orderResponseSchema.parse(JSON.parse(parsedText));
}

export async function generateOrderResponse(payload: OrderRequest): Promise<OrderResponse> {
  const fallbackResult = parseFallbackOrder(payload);

  if (shouldUseFallbackFirst(fallbackResult)) {
    return fallbackResult;
  }

  try {
    const openAIResult = await parseWithOpenAI(payload);

    if (openAIResult) {
      return openAIResult;
    }
  } catch (error) {
    console.warn("Falling back to rule-based parser:", error);
  }

  return fallbackResult;
}

export function applyActionsPreview(cart: CartItem[], actions: AIAction[]) {
  return actions.reduce<CartItem[]>((nextCart, action) => {
    if (action.type === "CLEAR_CART") {
      return [];
    }

    if (action.type === "REMOVE_ITEM") {
      return nextCart.filter((item) => item.itemId !== action.itemId);
    }

    if (action.type === "UPDATE_QUANTITY") {
      return action.quantity === 0
        ? nextCart.filter((item) => item.itemId !== action.itemId)
        : nextCart.map((item) =>
            item.itemId === action.itemId ? { ...item, quantity: action.quantity } : item,
          );
    }

    const menuItem = menuItemsById.get(action.itemId);

    if (!menuItem) {
      return nextCart;
    }

    const existingItem = nextCart.find((item) => item.itemId === action.itemId);

    if (!existingItem) {
      return [
        ...nextCart,
        {
          itemId: action.itemId,
          name: menuItem.name,
          price: menuItem.price,
          quantity: action.quantity,
          modifiers: action.modifiers,
        },
      ];
    }

    return nextCart.map((item) =>
      item.itemId === action.itemId
        ? {
            ...item,
            quantity: item.quantity + action.quantity,
          }
        : item,
    );
  }, cart);
}
