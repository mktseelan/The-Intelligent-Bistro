import "./global.css";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
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
  text: "I can update your order instantly. Ask naturally and I’ll translate it into precise cart actions for you.",
};

function SectionHeading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <View className="mb-4 mt-8">
      <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-copper">{eyebrow}</Text>
      <Text className="mt-2 text-[28px] font-bold leading-8 text-ink">{title}</Text>
      <Text className="mt-2 text-[15px] leading-6 text-cocoa">{detail}</Text>
    </View>
  );
}

function HeaderStats() {
  const itemCount = useCartStore((state) => state.getCartCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  return (
    <View className="mt-7 flex-row gap-3">
      <View className="flex-1 rounded-[26px] border border-white/70 bg-white/85 px-4 py-4 shadow-card">
        <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa/80">Items in cart</Text>
        <Text className="mt-2 text-[30px] font-bold text-ink">{itemCount}</Text>
        <Text className="mt-1 text-sm text-cocoa/80">Built for quick edits</Text>
      </View>
      <View className="flex-1 rounded-[26px] border border-white/70 bg-white/85 px-4 py-4 shadow-card">
        <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa/80">Current total</Text>
        <Text className="mt-2 text-[30px] font-bold text-ink">${cartTotal.toFixed(2)}</Text>
        <Text className="mt-1 text-sm text-cocoa/80">Live with every action</Text>
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
      className={`mr-3 rounded-full border px-5 py-3 shadow-card ${
        selected ? "border-copper bg-copper" : "border-white/80 bg-white"
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
    <View className="overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-float">
      <View className={`px-5 py-4 ${item.tintClass}`}>
        <View className="flex-row items-center justify-between">
          <View className="rounded-full bg-white/70 px-3 py-1">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.7px] text-ink">{item.category}</Text>
          </View>
          <Text className="text-[26px] font-bold text-ink">${item.price.toFixed(2)}</Text>
        </View>
      </View>

      <View className="px-5 pb-5 pt-4">
        <View className="flex-row items-center gap-2">
          <Text className="flex-1 text-[22px] font-bold leading-7 text-ink">{item.name}</Text>
          {item.isPopular ? (
            <View className="flex-row items-center gap-1 rounded-full bg-ink px-2 py-1">
              <Flame color="#F7F0E8" size={12} />
              <Text className="text-[10px] font-semibold uppercase tracking-[1.3px] text-cream">Popular</Text>
            </View>
          ) : null}
        </View>

        <Text className="mt-3 text-[15px] leading-6 text-cocoa">{item.description}</Text>

        <View className="mt-5 flex-row items-center justify-between rounded-[22px] bg-cream px-4 py-4">
          <View className="flex-1 pr-4">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.6px] text-cocoa/80">Why order it</Text>
            <Text className="mt-1 text-sm text-cocoa">{item.detail}</Text>
          </View>

          <Pressable className="rounded-full bg-burgundy px-5 py-3 shadow-card" onPress={onAdd}>
            <Text className="text-sm font-semibold text-cream">Add</Text>
          </Pressable>
        </View>
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
    <View className="mt-8 overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-float">
      <View className="bg-ink px-5 py-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="rounded-2xl bg-white/10 p-3">
              <ShoppingBag color="#F7F0E8" size={18} />
            </View>
            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-sand">Cart summary</Text>
              <Text className="mt-1 text-[26px] font-bold text-cream">{cartCount} items</Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-sand">Total</Text>
            <Text className="mt-1 text-[26px] font-bold text-cream">${cartTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View className="px-5 pb-5 pt-5">
        {items.length === 0 ? (
          <View className="items-center rounded-[26px] bg-cream px-5 py-8">
            <View className="rounded-full bg-white p-4 shadow-card">
              <ShoppingBag color="#C26A3D" size={20} />
            </View>
            <Text className="mt-4 text-center text-xl font-bold text-ink">Your cart is ready for something delicious</Text>
            <Text className="mt-2 text-center text-[15px] leading-6 text-cocoa">
              Add a few favorites manually or let the AI maître d’ build the order from a single message.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {items.map((item) => (
              <View
                key={`${item.itemId}-${item.modifiers.join(",")}`}
                className="rounded-[26px] border border-[#F1E3D6] bg-cream px-4 py-4"
              >
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-[17px] font-bold text-ink">{item.name}</Text>
                    <Text className="mt-1 text-sm text-cocoa">
                      ${item.price.toFixed(2)} each
                      {item.modifiers.length > 0 ? ` • ${item.modifiers.join(", ")}` : ""}
                    </Text>
                  </View>
                  <Text className="text-[17px] font-bold text-ink">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>

                <View className="mt-4 flex-row items-center justify-between">
                  <View className="flex-row items-center rounded-full bg-white px-2 py-2 shadow-card">
                    <Pressable
                      className="h-10 w-10 items-center justify-center rounded-full bg-cream"
                      onPress={() => updateQuantity(item.itemId, item.quantity - 1)}
                    >
                      <Minus color="#1E1916" size={18} />
                    </Pressable>
                    <Text className="w-10 text-center text-base font-semibold text-ink">{item.quantity}</Text>
                    <Pressable
                      className="h-10 w-10 items-center justify-center rounded-full bg-ink"
                      onPress={() => updateQuantity(item.itemId, item.quantity + 1)}
                    >
                      <Plus color="#F7F0E8" size={18} />
                    </Pressable>
                  </View>

                  <Pressable
                    className="flex-row items-center gap-2 rounded-full bg-white px-4 py-3"
                    onPress={() => removeItem(item.itemId)}
                  >
                    <Trash2 color="#C26A3D" size={16} />
                    <Text className="text-sm font-semibold text-copper">Remove</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        <Pressable
          className="mt-5 rounded-full border border-sand bg-white px-4 py-4 shadow-card"
          onPress={clearCart}
        >
          <Text className="text-center text-sm font-semibold text-cocoa">Clear cart</Text>
        </Pressable>
      </View>
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
    <View className="mt-8 overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-float">
      <View className="bg-blush px-5 py-5">
        <View className="flex-row items-center gap-3">
          <View className="rounded-2xl bg-burgundy p-3">
            <Bot color="#F7F0E8" size={18} />
          </View>
          <View className="flex-1">
            <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-cocoa">AI Assistant</Text>
            <Text className="mt-1 text-2xl font-bold text-ink">Your AI maître d’</Text>
          </View>
          <View className="rounded-full bg-white/70 px-3 py-2">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.6px] text-burgundy">Friendly</Text>
          </View>
        </View>

        <Text className="mt-4 text-[15px] leading-6 text-cocoa">
          Ask for items the way a guest naturally would. The assistant translates your request into precise cart actions.
        </Text>
      </View>

      <View className="px-5 pb-5 pt-4">
        <View className="rounded-[26px] bg-cream px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-cocoa">Latest response</Text>
          <Text className="mt-2 text-[15px] leading-6 text-ink">
            {latestAssistantMessage?.text ?? starterMessage.text}
          </Text>
        </View>

        <View className="mt-4 gap-3">
          {messages.slice(-3).map((message) => (
            <View
              key={message.id}
              className={`rounded-[24px] px-4 py-4 ${
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

        <View className="mt-5 rounded-[26px] border border-sand bg-cream px-4 py-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-cocoa/80">Tell the assistant</Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Try: Add two spicy chicken sandwiches and a large water"
            placeholderTextColor="#8A6A55"
            className="mt-2 min-h-[64px] text-[15px] leading-6 text-ink"
            multiline
          />
        </View>

        {isLoading ? (
          <View className="mt-4 flex-row items-center gap-3 rounded-[22px] bg-blush px-4 py-4">
            <ActivityIndicator color="#7B3F35" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-burgundy">Your AI maître d’ is preparing your update</Text>
              <Text className="mt-1 text-sm text-cocoa">Translating your request into cart actions...</Text>
            </View>
          </View>
        ) : null}

        <Pressable
          className={`mt-4 flex-row items-center justify-center gap-2 rounded-full px-4 py-4 shadow-card ${
            isLoading ? "bg-sand" : "bg-burgundy"
          }`}
          onPress={handleSend}
        >
          <SendHorizontal color="#F7F0E8" size={16} />
          <Text className="text-sm font-semibold text-cream">
            {isLoading ? "Sending..." : "Send to assistant"}
          </Text>
        </Pressable>
      </View>
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
          <View className="bg-parchment px-5 pb-20 pt-4">
            <View className="overflow-hidden rounded-[36px] bg-blush px-5 pb-7 pt-6 shadow-float">
              <View className="absolute -right-16 -top-12 h-44 w-44 rounded-full bg-[#C26A3D]/15" />
              <View className="absolute right-10 top-24 h-24 w-24 rounded-full bg-[#7B3F35]/10" />
              <View className="absolute -left-14 bottom-0 h-32 w-32 rounded-full bg-[#6D7A51]/10" />

              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <View className="rounded-full bg-white/80 p-2 shadow-card">
                      <ChefHat color="#6E4E37" size={18} />
                    </View>
                    <View className="rounded-full bg-white/80 px-3 py-2 shadow-card">
                      <Text className="text-[11px] font-semibold uppercase tracking-[1.8px] text-cocoa">
                        Table-ready ordering
                      </Text>
                    </View>
                  </View>

                  <Text className="mt-5 text-[36px] font-bold leading-10 text-ink">
                    The Intelligent Bistro
                  </Text>
                  <Text className="mt-3 text-[18px] font-medium leading-7 text-cocoa">
                    Order smarter with your AI maître d’
                  </Text>
                  <Text className="mt-4 max-w-[310px] text-[15px] leading-6 text-cocoa">
                    A warm, elevated ordering experience with premium menu browsing and conversational cart control.
                  </Text>
                </View>

                <View className="rounded-[26px] bg-white/85 p-4 shadow-card">
                  <Sparkles color="#7B3F35" size={24} />
                </View>
              </View>

              <HeaderStats />
            </View>

            <SectionHeading
              eyebrow="Explore"
              title="Curated bistro favorites"
              detail="Browse by craving, then add items manually or let the assistant assemble the order for you."
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-1">
              {menuSections.map((section) => (
                <CategoryChip
                  key={section}
                  label={section}
                  selected={selectedSection === section}
                  onPress={() => setSelectedSection(section)}
                />
              ))}
            </ScrollView>

            <View className="mt-6 gap-5">
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
