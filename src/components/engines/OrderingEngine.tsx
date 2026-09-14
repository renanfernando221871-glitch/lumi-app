import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OrderingActivity, ActivityInteraction } from "../../types";
import {
  createOrderingState,
  selectOrderingItem,
  OrderingState,
} from "../../engines/ordering";
import { colors, shadow } from "../../theme/colors";

export type OrderingEngineProps = {
  activity: OrderingActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

/**
 * A tap-to-build ordering engine. It intentionally has no drag dependency, so
 * the same data contract works with accessibility and touch-only interactions.
 */
export function OrderingEngine({
  activity,
  onInteraction,
  disabled = false,
}: OrderingEngineProps) {
  const [state, setState] = useState<OrderingState>(createOrderingState);
  const stateRef = useRef(state);

  useEffect(() => {
    const fresh = createOrderingState();
    stateRef.current = fresh;
    setState(fresh);
  }, [activity.id]);

  const choose = (itemId: string) => {
    if (disabled || stateRef.current.selectedItemIds.includes(itemId)) return;
    const result = selectOrderingItem(
      stateRef.current,
      itemId,
      activity.config.correctOrder,
    );
    stateRef.current = result.state;
    setState(result.state);
    if (result.incorrect) {
      onInteraction({ completed: false, feedback: activity.retryFeedback });
    } else if (result.completed) {
      onInteraction({ completed: true });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.orderHint}>{activity.config.orderingInstruction}</Text>
      <View style={styles.selected}>
        {state.selectedItemIds.length === 0 ? (
          <Text style={styles.placeholder}>Toque nos itens na ordem certa</Text>
        ) : (
          state.selectedItemIds.map((id, index) => {
            const item = activity.config.items.find(
              (candidate) => candidate.id === id,
            )!;
            return (
              <View key={id} style={styles.selectedItem}>
                <Text style={styles.selectedNumber}>{index + 1}</Text>
                <Text
                  style={[
                    styles.emoji,
                    { fontSize: 38 * (item.size ?? 1) },
                  ]}
                >
                  {item.emoji}
                </Text>
              </View>
            );
          })
        )}
      </View>
      <View style={styles.options}>
        {activity.config.items.map((item) => {
          const selected = state.selectedItemIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ disabled: disabled || selected, selected }}
              disabled={disabled || selected}
              onPress={() => choose(item.id)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <Text
                style={[
                  styles.optionEmoji,
                  { fontSize: 43 * (item.size ?? 1) },
                ]}
              >
                {item.emoji}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", gap: 15 },
  orderHint: {
    color: colors.blue,
    fontWeight: "800",
    textAlign: "center",
  },
  selected: {
    width: "100%",
    minHeight: 88,
    padding: 10,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: colors.softYellow,
    ...shadow,
  },
  placeholder: { color: colors.muted, fontWeight: "700" },
  selectedItem: {
    alignItems: "center",
    minWidth: 70,
    position: "relative",
  },
  selectedNumber: {
    position: "absolute",
    left: 0,
    top: 0,
    color: colors.green,
    fontWeight: "900",
  },
  emoji: { fontSize: 38 },
  optionEmoji: { fontSize: 43 },
  label: { color: colors.deepGreen, fontSize: 12, fontWeight: "800" },
  options: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  option: {
    width: 108,
    minHeight: 94,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.softBlue,
    ...shadow,
  },
  optionSelected: { opacity: 0.45, borderColor: colors.green },
  optionPressed: { transform: [{ scale: 0.95 }] },
});