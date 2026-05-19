import { Pressable, Text, View } from "react-native";
import type { MenuItem } from "../types";

type MenuCardProps = {
  item: MenuItem;
  onAdd: () => void;
};

export function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <View className="rounded-[24px] bg-white p-4 shadow-card">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-olive">
            {item.category}
          </Text>
          <Text className="mt-2 text-xl font-bold text-ink">{item.name}</Text>
          <Text className="mt-2 text-sm leading-6 text-cocoa">{item.description}</Text>
        </View>

        <View className="items-end">
          <Text className="text-lg font-bold text-ink">${item.price.toFixed(2)}</Text>
          <Pressable className="mt-8 rounded-full bg-copper px-4 py-2" onPress={onAdd}>
            <Text className="text-sm font-semibold text-white">Add to cart</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

