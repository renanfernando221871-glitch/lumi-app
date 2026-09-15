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

function LumiSeesCarScene() {
  return (
    <View
      accessibilityLabel="Lumi olhando para um carro"
      style={styles.sentenceScene}
    >
      <View style={styles.sceneLumi}>
        <View style={styles.sceneLumiHead}>
          <View style={styles.sceneLumiEye} />
          <View style={styles.sceneLumiSmile} />
        </View>
        <View style={styles.sceneLumiBody} />
      </View>
      <View style={styles.lookLine}>
        <View style={styles.lookDot} />
        <View style={styles.lookDot} />
        <View style={styles.lookDot} />
      </View>
      <View style={styles.sceneCar}>
        <View style={styles.carWindow} />
        <View style={[styles.carWheel, styles.carWheelLeft]} />
        <View style={[styles.carWheel, styles.carWheelRight]} />
      </View>
    </View>
  );
}

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
  const sentenceMode = activity.config.presentation === "sentence";
  const sentenceCompleted =
    sentenceMode &&
    state.selectedItemIds.length === activity.config.correctOrder.length;

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
      {activity.config.featuredVisual === "lumi-sees-car" ? (
        <LumiSeesCarScene />
      ) : null}
      <Text style={styles.orderHint}>{activity.config.orderingInstruction}</Text>
      <View style={[styles.selected, sentenceMode && styles.sentenceSelected]}>
        {sentenceCompleted ? (
          <Text style={styles.completedSentence}>
            {activity.config.completedText}
          </Text>
        ) : state.selectedItemIds.length === 0 ? (
          <Text style={styles.placeholder}>Toque nos itens na ordem certa</Text>
        ) : (
          state.selectedItemIds.map((id, index) => {
            const item = activity.config.items.find(
              (candidate) => candidate.id === id,
            )!;
            return (
              <View
                key={id}
                style={[
                  styles.selectedItem,
                  sentenceMode && styles.sentenceSelectedItem,
                ]}
              >
                <Text style={styles.selectedNumber}>{index + 1}</Text>
                <Text
                  style={[
                    styles.emoji,
                    { fontSize: 38 * (item.size ?? 1) },
                    sentenceMode && styles.sentenceWord,
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
                sentenceMode && styles.sentenceOption,
                selected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
            >
              <Text
                style={[
                  styles.optionEmoji,
                  { fontSize: 43 * (item.size ?? 1) },
                  sentenceMode && styles.sentenceOptionWord,
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
  sentenceScene: {
    width: 220,
    height: 104,
    borderRadius: 26,
    backgroundColor: colors.softYellow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  sceneLumi: {
    width: 48,
    height: 68,
    alignItems: "center",
  },
  sceneLumiHead: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#D99A72",
  },
  sceneLumiEye: {
    position: "absolute",
    top: 12,
    right: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#304A45",
  },
  sceneLumiSmile: {
    position: "absolute",
    right: 5,
    bottom: 8,
    width: 9,
    height: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#8C4E42",
    borderRadius: 5,
  },
  sceneLumiBody: {
    width: 30,
    height: 31,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#5F91AE",
  },
  lookLine: {
    width: 42,
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  lookDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.blue,
  },
  sceneCar: {
    width: 66,
    height: 34,
    marginTop: 20,
    borderRadius: 9,
    backgroundColor: "#E66D63",
  },
  carWindow: {
    position: "absolute",
    top: 5,
    right: 11,
    width: 23,
    height: 11,
    borderRadius: 4,
    backgroundColor: "#BFE0F2",
  },
  carWheel: {
    position: "absolute",
    bottom: -7,
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#AFC4C8",
    backgroundColor: "#40545B",
  },
  carWheelLeft: { left: 8 },
  carWheelRight: { right: 8 },
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
  sentenceSelected: {
    minHeight: 74,
    maxWidth: 430,
  },
  placeholder: { color: colors.muted, fontWeight: "700" },
  selectedItem: {
    alignItems: "center",
    minWidth: 70,
    position: "relative",
  },
  sentenceSelectedItem: {
    minWidth: 92,
  },
  selectedNumber: {
    position: "absolute",
    left: 0,
    top: 0,
    color: colors.green,
    fontWeight: "900",
  },
  emoji: { fontSize: 38 },
  sentenceWord: {
    fontSize: 24,
    lineHeight: 30,
    color: colors.deepGreen,
    fontWeight: "900",
  },
  completedSentence: {
    color: colors.deepGreen,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",
    textAlign: "center",
  },
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
  sentenceOption: {
    width: 126,
    minHeight: 74,
  },
  sentenceOptionWord: {
    fontSize: 24,
    lineHeight: 30,
    color: colors.deepGreen,
    fontWeight: "900",
    textAlign: "center",
  },
  optionSelected: { opacity: 0.45, borderColor: colors.green },
  optionPressed: { transform: [{ scale: 0.95 }] },
});