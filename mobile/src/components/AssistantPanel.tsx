import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { sendAIOrderMessage } from "../services/api";
import type { AIAction, CartItem, ChatMessage } from "../types";

type AssistantPanelProps = {
  cart: CartItem[];
  onApplyActions: (actions: AIAction[]) => void;
};

const starterMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "I can update your order conversationally. Try asking for two burgers, one spritz, or clear the cart.",
};

export function AssistantPanel({ cart, onApplyActions }: AssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const trimmed = input.trim();

    if (!trimmed || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendAIOrderMessage(trimmed, cart);

      onApplyActions(response.actions);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: response.reply,
          source: response.source,
        },
      ]);
    } catch (_error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "I couldn't reach the Bistro assistant. Make sure the backend is running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="rounded-[24px] bg-white p-5 shadow-card">
      <View className="gap-3">
        {messages.map((message) => {
          const assistantMessage = message.role === "assistant";

          return (
            <View
              key={message.id}
              className={`rounded-2xl px-4 py-3 ${assistantMessage ? "bg-cream" : "bg-ink"}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`text-xs font-semibold uppercase tracking-[1.5px] ${assistantMessage ? "text-cocoa" : "text-sand"}`}>
                  {assistantMessage ? "Assistant" : "You"}
                </Text>
                {message.source ? (
                  <Text className="text-[11px] uppercase tracking-[1.2px] text-copper">
                    {message.source}
                  </Text>
                ) : null}
              </View>
              <Text className={`mt-2 text-sm leading-6 ${assistantMessage ? "text-ink" : "text-cream"}`}>
                {message.text}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="mt-4 rounded-2xl border border-sand bg-cream px-4 py-3">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Add two burgers and a spritz"
          placeholderTextColor="#8A6A55"
          className="text-base text-ink"
        />
      </View>

      <Pressable
        className={`mt-4 items-center rounded-full px-4 py-3 ${loading ? "bg-sand" : "bg-ink"}`}
        onPress={handleSend}
      >
        <Text className="text-sm font-semibold text-cream">
          {loading ? "Thinking..." : "Send to assistant"}
        </Text>
      </Pressable>
    </View>
  );
}
