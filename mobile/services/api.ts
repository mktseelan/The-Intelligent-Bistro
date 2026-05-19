import axios from "axios";
import type { CartItem, OrderResponse } from "../types";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:4000/api",
  timeout: 10000,
});

export async function sendOrderMessage(message: string, cart: CartItem[]) {
  const response = await apiClient.post<OrderResponse>("/ai/order", {
    message,
    cart,
  });

  return response.data;
}

