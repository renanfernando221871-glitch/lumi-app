import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ActivityInteraction,
  ClassificationActivity,
} from "../../types";
import { colors, shadow } from "../../theme/colors";
import {
  classifyCurrentItem,
  createClassificationState,
} from "../../engines/classification";

type Props = {
  activity: ClassificationActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export function ClassificationEngine({
  activity,
  onInteraction,
  disabled = false,
}: Props) {
  const [state, setState] = useState(createClassificationState);

  useEffect(() => setState(createClassificationState()), [activity.id]);

  const item = activity.config.items[state.nextItemIndex];
  const choose = (categoryId: string) => {
    if (disabled || !item) return;
    const next = classifyCurrentItem(activity, state, categoryId);
    if (next === state) {
      onInteraction({ completed: false, feedback: activity.retryFeedback });
      return;
    }
    setState(next);
    onInteraction({
      completed: next.complete,
      feedback: next.complete
        ? activity.successFeedback
        : `Muito bem! Agora vamos classificar ${activity.config.items[next.nextItemIndex].label}.`,
    });
  };

  if (!item) return null;
  return (
    <View style={styles.container}>
      <View style={[styles.item, { backgroundColor: item.color }]}>
        <Text style={styles.itemEmoji}>{item.emoji}</Text>
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <View style={styles.categories}>
        {activity.config.categories.map((category) => (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityLabel={category.label}
            disabled={disabled}
            onPress={() => choose(category.id)}
            style={({ pressed }) => [
              styles.category,
              {
                backgroundColor: category.color,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={styles.label}>{category.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", gap: 22 },
  item: {
    minWidth: 170,
    minHeight: 120,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  itemEmoji: { fontSize: 58 },
  categories: { flexDirection: "row", justifyContent: "center", gap: 14 },
  category: {
    width: 145,
    minHeight: 100,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  categoryEmoji: { fontSize: 35 },
  label: { color: colors.deepGreen, fontSize: 16, fontWeight: "900" },
});