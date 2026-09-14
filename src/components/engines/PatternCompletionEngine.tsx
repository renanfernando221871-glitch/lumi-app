import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { evaluatePatternCompletion } from "../../engines/interactions";
import { ActivityInteraction, PatternCompletionActivity } from "../../types";
import { colors, shadow } from "../../theme/colors";

export type PatternCompletionEngineProps = {
  activity: PatternCompletionActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export function PatternCompletionEngine({
  activity,
  onInteraction,
  disabled = false,
}: PatternCompletionEngineProps) {
  const { sequence, options, placeholder, prompt } = activity.config;
  return (
    <View style={styles.container}>
      {prompt ? <Text style={styles.prompt}>{prompt}</Text> : null}
      <View
        accessibilityLabel="sequência do padrão"
        style={styles.sequence}
      >
        {sequence.map((token, index) => (
          <React.Fragment key={`${token.id}-${index}`}>
            <View
              accessibilityLabel={token.label}
              style={[
                styles.token,
                token.color ? { backgroundColor: token.color } : undefined,
              ]}
            >
              <Text style={styles.tokenEmoji}>{token.emoji ?? token.label}</Text>
            </View>
            {index === sequence.length - 1 ? (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>{placeholder ?? "?"}</Text>
              </View>
            ) : null}
          </React.Fragment>
        ))}
      </View>
      <View style={styles.options}>
        {options.map((option) => (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            disabled={disabled}
            onPress={() =>
              onInteraction(evaluatePatternCompletion(activity, option.id))
            }
            style={({ pressed }) => [
              styles.option,
              option.color ? { borderColor: option.color } : undefined,
              pressed && styles.optionPressed,
            ]}
          >
            <Text style={styles.optionEmoji}>{option.emoji ?? option.label}</Text>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", gap: 18 },
  prompt: {
    color: colors.deepGreen,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  sequence: {
    width: "100%",
    maxWidth: 450,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 26,
    backgroundColor: colors.softYellow,
    ...shadow,
  },
  token: {
    width: 58,
    height: 58,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  tokenEmoji: { fontSize: 29, color: colors.deepGreen, fontWeight: "900" },
  placeholder: {
    width: 58,
    height: 58,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: colors.green,
  },
  placeholderText: { fontSize: 30, color: colors.green, fontWeight: "900" },
  options: {
    width: "100%",
    maxWidth: 450,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  option: {
    minWidth: 105,
    minHeight: 82,
    padding: 10,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.softBlue,
    backgroundColor: colors.white,
    ...shadow,
  },
  optionPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: colors.softBlue,
  },
  optionEmoji: { fontSize: 29, color: colors.deepGreen, fontWeight: "900" },
  optionLabel: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },
});