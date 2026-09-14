import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      onPress={onPress}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.65 : 1 }]}
    >
      <Text style={styles.icon}>‹</Text>
      <Text style={styles.label}>Voltar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  icon: {
    color: colors.deepGreen,
    fontSize: 32,
    lineHeight: 32,
  },
  label: {
    color: colors.deepGreen,
    fontSize: 15,
    fontWeight: "700",
  },
});