import { Text, View } from "react-native";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <View className="mb-4 mt-8">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-copper">{eyebrow}</Text>
      <Text className="mt-2 text-2xl font-bold text-ink">{title}</Text>
      <Text className="mt-2 text-sm leading-6 text-cocoa">{description}</Text>
    </View>
  );
}

