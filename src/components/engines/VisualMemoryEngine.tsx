import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityInteraction, VisualMemoryActivity } from "../../types";
import { colors, shadow } from "../../theme/colors";
import { evaluateVisualMemory } from "../../engines/visualMemory";

type Props = {
  activity: VisualMemoryActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export function VisualMemoryEngine({
  activity,
  onInteraction,
  disabled = false,
}: Props) {
  const [studying, setStudying] = useState(true);

  useEffect(() => {
    setStudying(true);
    const timer = setTimeout(
      () => setStudying(false),
      activity.config.revealDurationMs ?? 2500,
    );
    return () => clearTimeout(timer);
  }, [activity.id, activity.config.revealDurationMs]);

  const choose = (itemId: string) => {
    if (disabled || studying) return;
    onInteraction(evaluateVisualMemory(activity, itemId));
  };

  const visibleItems = studying
    ? activity.config.items
    : activity.config.items.filter(
        ({ id }) => id !== activity.config.missingItemId,
      );

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>
        {studying
          ? activity.config.studyPrompt ?? "Olhe com atenção..."
          : activity.config.questionPrompt ?? "O que sumiu?"}
      </Text>
      <View style={styles.row}>
        {visibleItems.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
        ))}
        {!studying ? <View style={[styles.card, styles.missing]}><Text style={styles.question}>?</Text></View> : null}
      </View>
      {!studying ? (
        <View style={styles.options}>
          {activity.config.items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              disabled={disabled}
              onPress={() => choose(item.id)}
              style={({ pressed }) => [
                styles.option,
                { borderColor: item.color, opacity: pressed ? 0.72 : 1 },
              ]}
            >
              <Text style={styles.optionEmoji}>{item.emoji}</Text>
              <Text style={styles.optionLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", gap: 18 },
  prompt: { color: colors.deepGreen, fontSize: 18, fontWeight: "900" },
  row: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 10 },
  card: {
    width: 74,
    height: 74,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  missing: { borderWidth: 3, borderStyle: "dashed", borderColor: colors.muted, backgroundColor: colors.white },
  question: { color: colors.muted, fontSize: 36, fontWeight: "900" },
  emoji: { fontSize: 39 },
  options: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 10 },
  option: {
    minWidth: 100,
    minHeight: 78,
    borderWidth: 3,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  optionEmoji: { fontSize: 31 },
  optionLabel: { color: colors.deepGreen, fontSize: 13, fontWeight: "800" },
});