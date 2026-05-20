import axios from "axios";
import type { CartItem, OrderResponse } from "../types";

export const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.0.0.160:4000/api";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

export async function sendOrderMessage(message: string, cart: CartItem[]) {
  const response = await apiClient.post<OrderResponse>("/ai/order", {
    message,
    cart,
  });

  return response.data;
}
