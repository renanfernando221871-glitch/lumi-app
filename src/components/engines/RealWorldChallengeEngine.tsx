import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { evaluateRealWorldChallenge } from "../../engines/interactions";
import { ActivityInteraction, RealWorldChallengeActivity } from "../../types";
import { colors, shadow } from "../../theme/colors";

export type RealWorldChallengeEngineProps = {
  activity: RealWorldChallengeActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export function RealWorldChallengeEngine({
  activity,
  onInteraction,
  disabled = false,
}: RealWorldChallengeEngineProps) {
  const { prompt, confirmationLabel, visual } = activity.config;
  return (
    <View style={styles.container}>
      <View
        accessibilityLabel={visual.label}
        style={[
          styles.visual,
          visual.color ? { backgroundColor: visual.color } : undefined,
        ]}
      >
        <Text style={styles.visualEmoji}>{visual.emoji}</Text>
        <Text style={styles.visualLabel}>{visual.label}</Text>
      </View>
      <Text style={styles.prompt}>{prompt}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={confirmationLabel}
        disabled={disabled}
        onPress={() =>
          onInteraction(evaluateRealWorldChallenge(activity, true))
        }
        style={({ pressed }) => [
          styles.confirm,
          pressed && styles.confirmPressed,
        ]}
      >
        <Text style={styles.confirmText}>{confirmationLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", gap: 18 },
  visual: {
    width: "100%",
    maxWidth: 390,
    minHeight: 150,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.softBlue,
    ...shadow,
  },
  visualEmoji: { fontSize: 68 },
  visualLabel: {
    marginTop: 4,
    color: colors.deepGreen,
    fontSize: 15,
    fontWeight: "800",
  },
  prompt: {
    color: colors.deepGreen,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    textAlign: "center",
  },
  confirm: {
    minWidth: 190,
    minHeight: 58,
    paddingHorizontal: 24,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
    ...shadow,
  },
  confirmPressed: { transform: [{ scale: 0.96 }], opacity: 0.86 },
  confirmText: { color: colors.white, fontSize: 18, fontWeight: "900" },
});