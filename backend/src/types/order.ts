import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
});

export const orderRequestSchema = z.object({
  message: z.string().trim().min(1),
  cart: z.array(cartItemSchema).default([]),
});

export const addItemActionSchema = z.object({
  type: z.literal("add_item"),
  itemId: z.string(),
  quantity: z.number().int().positive(),
});

export const updateQuantityActionSchema = z.object({
  type: z.literal("update_quantity"),
  itemId: z.string(),
  quantity: z.number().int().nonnegative(),
});

export const removeItemActionSchema = z.object({
  type: z.literal("remove_item"),
  itemId: z.string(),
});

export const clearCartActionSchema = z.object({
  type: z.literal("clear_cart"),
});

export const aiActionSchema = z.discriminatedUnion("type", [
  addItemActionSchema,
  updateQuantityActionSchema,
  removeItemActionSchema,
  clearCartActionSchema,
]);

export const aiOrderResponseSchema = z.object({
  reply: z.string(),
  actions: z.array(aiActionSchema),
  source: z.enum(["openai", "fallback"]),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type OrderRequest = z.infer<typeof orderRequestSchema>;
export type AIAction = z.infer<typeof aiActionSchema>;
export type AIOrderResponse = z.infer<typeof aiOrderResponseSchema>;

