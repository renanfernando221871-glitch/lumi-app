import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { evaluateCountAndSelect } from "../../engines/interactions";
import { ActivityInteraction, CountAndSelectActivity } from "../../types";
import { colors, shadow } from "../../theme/colors";

export type CountAndSelectEngineProps = {
  activity: CountAndSelectActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export function CountAndSelectEngine({
  activity,
  onInteraction,
  disabled = false,
}: CountAndSelectEngineProps) {
  return (
    <View style={styles.container}>
      <View
        accessibilityLabel={`${activity.config.displayCount} ${activity.config.itemLabel}`}
        style={styles.items}
      >
        {Array.from({ length: activity.config.displayCount }, (_, index) => (
          <Text key={index} style={styles.item}>
            {activity.config.itemEmoji}
          </Text>
        ))}
      </View>
      <View style={styles.options}>
        {activity.config.options.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityLabel={`quantidade ${option}`}
            disabled={disabled}
            onPress={() =>
              onInteraction(evaluateCountAndSelect(activity, option))
            }
            style={({ pressed }) => [
              styles.option,
              pressed && styles.optionPressed,
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 28,
  },
  items: {
    width: "100%",
    maxWidth: 390,
    minHeight: 112,
    padding: 18,
    borderRadius: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: colors.softYellow,
    ...shadow,
  },
  item: { fontSize: 54 },
  options: {
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  option: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.softBlue,
    ...shadow,
  },
  optionPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: colors.softBlue,
  },
  optionText: {
    color: colors.deepGreen,
    fontSize: 30,
    fontWeight: "900",
  },
});