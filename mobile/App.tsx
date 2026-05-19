import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Bot,
  ChefHat,
  Flame,
  Minus,
  Plus,
  SendHorizontal,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react-native";
import { menuItems, menuSections } from "./data/menu";
import { sendOrderMessage } from "./services/api";
import { useCartStore } from "./store/cartStore";
import type { AssistantMessage, MenuItem, MenuSection } from "./types";

const starterMessage: AssistantMessage = {
  id: "starter-message",
  role: "assistant",
  text: "I can update your order instantly. Ask for items naturally and I’ll translate that into cart actions.",
};

function HeaderStats() {
  const itemCount = useCartStore((state) => state.getCartCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  return (
    <View className="mt-6 flex-row gap-3">
      <View className="flex-1 rounded-[24px] bg-white/75 px-4 py-4">
        <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa/80">Items</Text>
        <Text className="mt-1 text-3xl font-bold text-ink">{itemCount}</Text>
      </View>
      <View className="flex-1 rounded-[24px] bg-white/75 px-4 py-4">
        <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa/80">Total</Text>
        <Text className="mt-1 text-3xl font-bold text-ink">${cartTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

function CategoryChip({
  label,
  selected,
  onPress,
}: {
  label: MenuSection;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`mr-3 rounded-full border px-4 py-3 ${
        selected ? "border-ink bg-ink" : "border-sand bg-white/80"
      }`}
      onPress={onPress}
    >
      <Text className={`text-sm font-semibold ${selected ? "text-cream" : "text-cocoa"}`}>{label}</Text>
    </Pressable>
  );
}

function MenuCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: () => void;
}) {
  return (
    <View className="rounded-[28px] border border-white/70 bg-white px-5 py-5 shadow-card">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <View className={`rounded-full px-3 py-1 ${item.tintClass}`}>
              <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-ink">{item.category}</Text>
            </View>
            {item.isPopular ? (
              <View className="flex-row items-center gap-1 rounded-full bg-ink px-2 py-1">
                <Flame color="#F7F0E8" size={12} />
                <Text className="text-[10px] font-semibold uppercase tracking-[1.3px] text-cream">Popular</Text>
              </View>
            ) : null}
          </View>

          <Text className="mt-4 text-[22px] font-bold leading-7 text-ink">{item.name}</Text>
          <Text className="mt-2 text-[15px] leading-6 text-cocoa">{item.description}</Text>
        </View>

        <View className="items-end">
          <Text className="text-2xl font-bold text-ink">${item.price.toFixed(2)}</Text>
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-sm text-cocoa">{item.detail}</Text>
        <Pressable className="rounded-full bg-ink px-4 py-3" onPress={onAdd}>
          <Text className="text-sm font-semibold text-cream">Add to cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CartSection() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartCount = useCartStore((state) => state.getCartCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  return (
    <View className="mt-8 rounded-[30px] border border-white/70 bg-white px-5 py-5 shadow-card">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="rounded-2xl bg-blush p-3">
            <ShoppingBag color="#6E4E37" size={18} />
          </View>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa">Cart</Text>
            <Text className="mt-1 text-2xl font-bold text-ink">{cartCount} items</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa">Total</Text>
          <Text className="mt-1 text-2xl font-bold text-ink">${cartTotal.toFixed(2)}</Text>
        </View>
      </View>

      {items.length === 0 ? (
        <View className="mt-5 rounded-[24px] bg-cream px-4 py-5">
          <Text className="text-lg font-bold text-ink">Your cart is empty</Text>
          <Text className="mt-2 text-[15px] leading-6 text-cocoa">
            Add menu items manually or let the AI maître d’ assemble the order for you.
          </Text>
        </View>
      ) : (
        <View className="mt-5 gap-3">
          {items.map((item) => (
            <View key={`${item.itemId}-${item.modifiers.join(",")}`} className="rounded-[24px] bg-cream px-4 py-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-bold text-ink">{item.name}</Text>
                  <Text className="mt-1 text-sm text-cocoa">
                    ${item.price.toFixed(2)} each
                    {item.modifiers.length > 0 ? ` • ${item.modifiers.join(", ")}` : ""}
                  </Text>
                </View>
                <Text className="text-base font-bold text-ink">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Pressable
                    className="h-10 w-10 items-center justify-center rounded-full bg-white"
                    onPress={() => updateQuantity(item.itemId, item.quantity - 1)}
                  >
                    <Minus color="#1E1916" size={18} />
                  </Pressable>
                  <Text className="w-8 text-center text-base font-semibold text-ink">{item.quantity}</Text>
                  <Pressable
                    className="h-10 w-10 items-center justify-center rounded-full bg-white"
                    onPress={() => updateQuantity(item.itemId, item.quantity + 1)}
                  >
                    <Plus color="#1E1916" size={18} />
                  </Pressable>
                </View>

                <Pressable className="flex-row items-center gap-2" onPress={() => removeItem(item.itemId)}>
                  <Trash2 color="#C26A3D" size={16} />
                  <Text className="text-sm font-semibold text-copper">Remove</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      <Pressable className="mt-5 rounded-full border border-sand px-4 py-3" onPress={clearCart}>
        <Text className="text-center text-sm font-semibold text-cocoa">Clear cart</Text>
      </Pressable>
    </View>
  );
}

function AssistantSection() {
  const cart = useCartStore((state) => state.items);
  const applyAIActions = useCartStore((state) => state.applyAIActions);
  const [messages, setMessages] = useState<AssistantMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    const trimmed = input.trim();

    if (!trimmed || isLoading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text: trimmed,
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendOrderMessage(trimmed, cart);
      applyAIActions(response.actions);

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: response.message,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "I couldn't reach the AI maître d’. Make sure the backend is running and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");

  return (
    <View className="mt-8 rounded-[30px] border border-white/70 bg-white px-5 py-5 shadow-card">
      <View className="flex-row items-center gap-3">
        <View className="rounded-2xl bg-ink p-3">
          <Bot color="#F7F0E8" size={18} />
        </View>
        <View className="flex-1">
          <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa">AI Assistant</Text>
          <Text className="mt-1 text-2xl font-bold text-ink">Your AI maître d’</Text>
        </View>
      </View>

      <View className="mt-5 rounded-[24px] bg-cream px-4 py-4">
        <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-cocoa">Latest response</Text>
        <Text className="mt-2 text-[15px] leading-6 text-ink">
          {latestAssistantMessage?.text ?? starterMessage.text}
        </Text>
      </View>

      <View className="mt-4 gap-3">
        {messages.slice(-3).map((message) => (
          <View
            key={message.id}
            className={`rounded-[22px] px-4 py-3 ${
              message.role === "assistant" ? "bg-blush" : "bg-ink"
            }`}
          >
            <Text
              className={`text-xs font-semibold uppercase tracking-[1.5px] ${
                message.role === "assistant" ? "text-cocoa" : "text-sand"
              }`}
            >
              {message.role === "assistant" ? "Assistant" : "You"}
            </Text>
            <Text
              className={`mt-2 text-[15px] leading-6 ${
                message.role === "assistant" ? "text-ink" : "text-cream"
              }`}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-5 rounded-[24px] border border-sand bg-cream px-4 py-3">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Try: Add two spicy chicken sandwiches and a large water"
          placeholderTextColor="#8A6A55"
          className="min-h-[52px] text-[15px] leading-6 text-ink"
          multiline
        />
      </View>

      <Pressable
        className={`mt-4 flex-row items-center justify-center gap-2 rounded-full px-4 py-4 ${
          isLoading ? "bg-sand" : "bg-ink"
        }`}
        onPress={handleSend}
      >
        <SendHorizontal color="#F7F0E8" size={16} />
        <Text className="text-sm font-semibold text-cream">
          {isLoading ? "Sending..." : "Send to assistant"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const selectedSection = useCartStore((state) => state.selectedSection);
  const setSelectedSection = useCartStore((state) => state.setSelectedSection);
  const addItem = useCartStore((state) => state.addItem);

  const visibleMenuItems =
    selectedSection === "Popular"
      ? menuItems.filter((item) => item.isPopular)
      : menuItems.filter((item) => item.category === selectedSection);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FBF5EF" }}>
        <StatusBar style="dark" />
        <ScrollView className="flex-1">
          <View className="px-5 pb-16 pt-4">
            <View className="overflow-hidden rounded-[34px] bg-blush px-5 pb-6 pt-6 shadow-card">
              <View className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-copper/15" />
              <View className="absolute -left-14 bottom-0 h-32 w-32 rounded-full bg-olive/10" />

              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <View className="rounded-full bg-white/70 p-2">
                      <ChefHat color="#6E4E37" size={18} />
                    </View>
                    <View className="rounded-full bg-white/70 px-3 py-2">
                      <Text className="text-[11px] font-semibold uppercase tracking-[1.7px] text-cocoa">
                        The Intelligent Bistro
                      </Text>
                    </View>
                  </View>

                  <Text className="mt-5 text-[34px] font-bold leading-10 text-ink">
                    The Intelligent Bistro
                  </Text>
                  <Text className="mt-2 text-lg font-medium text-cocoa">
                    Order smarter with your AI maître d’
                  </Text>
                </View>

                <View className="rounded-[24px] bg-white/80 p-3">
                  <Sparkles color="#C26A3D" size={22} />
                </View>
              </View>

              <HeaderStats />
            </View>

            <View className="mt-8">
              <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa">Categories</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                {menuSections.map((section) => (
                  <CategoryChip
                    key={section}
                    label={section}
                    selected={selectedSection === section}
                    onPress={() => setSelectedSection(section)}
                  />
                ))}
              </ScrollView>
            </View>

            <View className="mt-8 gap-4">
              {visibleMenuItems.map((item) => (
                <MenuCard key={item.itemId} item={item} onAdd={() => addItem(item)} />
              ))}
            </View>

            <CartSection />
            <AssistantSection />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
