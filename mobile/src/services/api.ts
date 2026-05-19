import axios from "axios";
import type { AIOrderResponse, CartItem } from "../types";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000/api",
  timeout: 10000,
});

export async function sendAIOrderMessage(message: string, cart: CartItem[]) {
  const response = await api.post<AIOrderResponse>("/ai/order", {
    message,
    cart,
  });

  return response.data;
}

