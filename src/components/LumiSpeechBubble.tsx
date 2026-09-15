import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "../theme/colors";
import { LumiCharacter, LumiExpression } from "./LumiCharacter";

export function LumiSpeechBubble({
  children,
  compact = false,
  expression = "happy",
}: {
  children: React.ReactNode;
  compact?: boolean;
  expression?: LumiExpression;
}) {
  return (
    <View style={[styles.wrap, compact && styles.compactWrap]}>
      <LumiCharacter expression={expression} size={compact ? "small" : "medium"} />
      <View style={[styles.bubble, compact && styles.compactBubble]}>
        <Text style={[styles.text, compact && styles.compactText]}>
          {children}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  compactWrap: {
    gap: 8,
  },
  bubble: {
    flex: 1,
    minHeight: 68,
    borderRadius: 22,
    borderBottomLeftRadius: 6,
    padding: 16,
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  compactBubble: {
    minHeight: 52,
    padding: 12,
    borderRadius: 17,
    borderBottomLeftRadius: 5,
  },
  text: {
    color: colors.deepGreen,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
  },
  compactText: {
    fontSize: 14,
    lineHeight: 19,
  },
});