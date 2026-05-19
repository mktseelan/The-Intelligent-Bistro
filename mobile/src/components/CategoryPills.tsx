import { Pressable, Text, View } from "react-native";
import type { MenuCategory } from "../types";

type CategoryPillsProps = {
  categories: MenuCategory[];
  selectedCategory: MenuCategory;
  onSelect: (category: MenuCategory) => void;
};

export function CategoryPills({ categories, selectedCategory, onSelect }: CategoryPillsProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {categories.map((category) => {
        const selected = category === selectedCategory;

        return (
          <Pressable
            key={category}
            className={`rounded-full px-4 py-2 ${selected ? "bg-ink" : "bg-white"}`}
            onPress={() => onSelect(category)}
          >
            <Text className={`text-sm font-semibold ${selected ? "text-cream" : "text-cocoa"}`}>
              {category}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

