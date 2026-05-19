import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AssistantPanel } from "./src/components/AssistantPanel";
import { CartPanel } from "./src/components/CartPanel";
import { CategoryPills } from "./src/components/CategoryPills";
import { MenuCard } from "./src/components/MenuCard";
import { SectionHeader } from "./src/components/SectionHeader";
import { menu, menuCategories } from "./src/data/menu";
import { useCartStore } from "./src/store/cartStore";

export default function App() {
  const selectedCategory = useCartStore((state) => state.selectedCategory);
  const setSelectedCategory = useCartStore((state) => state.setSelectedCategory);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const applyAIActions = useCartStore((state) => state.applyAIActions);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredMenu = selectedCategory === "All"
    ? menu
    : menu.filter((item) => item.category === selectedCategory);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F0E8" }}>
        <StatusBar style="dark" />
        <ScrollView className="flex-1">
          <View className="px-5 pb-16 pt-4">
            <View className="rounded-[28px] bg-blush px-5 pb-6 pt-5 shadow-card">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-cocoa">
                The Intelligent Bistro
              </Text>
              <Text className="mt-3 text-3xl font-bold leading-9 text-ink">
                Premium comfort food with a cart you can control by chat.
              </Text>
              <Text className="mt-3 text-base leading-6 text-cocoa">
                Browse the menu, adjust quantities, or tell the assistant what you want in plain English.
              </Text>
              <View className="mt-5 flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-cream px-4 py-3">
                  <Text className="text-xs uppercase tracking-[1.5px] text-cocoa">Items</Text>
                  <Text className="mt-1 text-2xl font-bold text-ink">{itemCount}</Text>
                </View>
                <View className="flex-1 rounded-2xl bg-cream px-4 py-3">
                  <Text className="text-xs uppercase tracking-[1.5px] text-cocoa">Subtotal</Text>
                  <Text className="mt-1 text-2xl font-bold text-ink">${subtotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <SectionHeader
              eyebrow="Menu"
              title="Curated for a polished demo"
              description="Warm visuals, fast browsing, and actions that map cleanly into the cart."
            />

            <CategoryPills
              categories={menuCategories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <View className="mt-4 gap-4">
              {filteredMenu.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAdd={() => addItem(item, 1)}
                />
              ))}
            </View>

            <SectionHeader
              eyebrow="Cart"
              title="Live order summary"
              description="Every button press and AI response updates the same shared state."
            />

            <CartPanel
              items={items}
              onRemove={removeItem}
              onUpdateQuantity={updateQuantity}
            />

            <SectionHeader
              eyebrow="Assistant"
              title="Natural language ordering"
              description="Try: add two burgers, remove fries, or clear my cart."
            />

            <AssistantPanel cart={items} onApplyActions={applyAIActions} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
