import { menu } from "../data/menu.js";
import { env } from "../config/env.js";
import type { AIOrderResponse, OrderRequest } from "../types/order.js";
import { aiOrderResponseSchema } from "../types/order.js";

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function buildPrompt({ message, cart }: OrderRequest) {
  return [
    "You convert restaurant ordering chat into JSON cart actions.",
    "Return JSON only with this exact shape:",
    JSON.stringify({
      reply: "Short, friendly summary of what changed.",
      actions: [
        {
          type: "add_item",
          itemId: "menu-item-id",
          quantity: 1,
        },
      ],
    }),
    "Allowed action types: add_item, update_quantity, remove_item, clear_cart.",
    "Use only menu item ids from this menu:",
    JSON.stringify(
      menu.map((item) => ({
        id: item.id,
        name: item.name,
        aliases: item.aliases,
      })),
    ),
    "Current cart:",
    JSON.stringify(cart),
    "User message:",
    message,
  ].join("\n");
}

function extractJsonText(response: OpenAIResponse) {
  if (response.output_text) {
    return response.output_text;
  }

  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .find((entry) => entry.type === "output_text" || typeof entry.text === "string")
      ?.text ?? ""
  );
}

export async function parseOrderWithOpenAI(payload: OrderRequest): Promise<AIOrderResponse | null> {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: buildPrompt(payload),
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const rawText = extractJsonText(data);
  const parsed = aiOrderResponseSchema.omit({ source: true }).parse(JSON.parse(rawText));

  return {
    ...parsed,
    source: "openai",
  };
}

