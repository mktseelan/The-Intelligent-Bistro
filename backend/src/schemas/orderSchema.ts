import { z } from "zod";

export const cartItemSchema = z.object({
  itemId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  modifiers: z.array(z.string().trim()).default([]),
});

export const orderRequestSchema = z.object({
  message: z.string().trim().min(1),
  cart: z.array(cartItemSchema).default([]),
});

export const addItemActionSchema = z.object({
  type: z.literal("ADD_ITEM"),
  itemId: z.string().trim().min(1),
  quantity: z.number().int().positive(),
  modifiers: z.array(z.string().trim()).default([]),
});

export const removeItemActionSchema = z.object({
  type: z.literal("REMOVE_ITEM"),
  itemId: z.string().trim().min(1),
});

export const updateQuantityActionSchema = z.object({
  type: z.literal("UPDATE_QUANTITY"),
  itemId: z.string().trim().min(1),
  quantity: z.number().int().nonnegative(),
});

export const clearCartActionSchema = z.object({
  type: z.literal("CLEAR_CART"),
});

export const aiActionSchema = z.discriminatedUnion("type", [
  addItemActionSchema,
  removeItemActionSchema,
  updateQuantityActionSchema,
  clearCartActionSchema,
]);

export const orderResponseSchema = z.object({
  message: z.string(),
  actions: z.array(aiActionSchema),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type OrderRequest = z.infer<typeof orderRequestSchema>;
export type AIAction = z.infer<typeof aiActionSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
