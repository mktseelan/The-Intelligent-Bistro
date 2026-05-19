import { Pressable, Text, View } from "react-native";
import type { CartItem } from "../types";

type CartPanelProps = {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
};

export function CartPanel({ items, onUpdateQuantity, onRemove }: CartPanelProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <View className="rounded-[24px] bg-white p-5 shadow-card">
        <Text className="text-lg font-bold text-ink">Your cart is empty</Text>
        <Text className="mt-2 text-sm leading-6 text-cocoa">
          Add items from the menu or ask the assistant to build your order.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-[24px] bg-white p-5 shadow-card">
      <View className="gap-4">
        {items.map((item) => (
          <View
            key={item.id}
            className="rounded-2xl border border-sand bg-cream px-4 py-4"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-base font-bold text-ink">{item.name}</Text>
                <Text className="mt-1 text-sm text-cocoa">${item.price.toFixed(2)} each</Text>
              </View>

              <Text className="text-base font-bold text-ink">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Pressable
                  className="h-10 w-10 items-center justify-center rounded-full bg-white"
                  onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Text className="text-lg font-bold text-ink">-</Text>
                </Pressable>
                <Text className="w-8 text-center text-base font-semibold text-ink">
                  {item.quantity}
                </Text>
                <Pressable
                  className="h-10 w-10 items-center justify-center rounded-full bg-white"
                  onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Text className="text-lg font-bold text-ink">+</Text>
                </Pressable>
              </View>

              <Pressable onPress={() => onRemove(item.id)}>
                <Text className="text-sm font-semibold text-copper">Remove</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-5 flex-row items-center justify-between border-t border-sand pt-4">
        <Text className="text-sm uppercase tracking-[1.5px] text-cocoa">Subtotal</Text>
        <Text className="text-2xl font-bold text-ink">${subtotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

