import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, shadow } from "../theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "green" | "blue" | "yellow";
  disabled?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  variant = "green",
  disabled = false,
  style,
}: Props) {
  const backgroundColor =
    variant === "blue"
      ? colors.blue
      : variant === "yellow"
        ? colors.yellow
        : colors.green;
  const textColor = variant === "yellow" ? colors.deepGreen : colors.white;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.84 : 1 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Text style={[styles.arrow, { color: textColor }]}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 22,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    ...shadow,
  },
  label: {
    fontSize: 18,
    fontWeight: "800",
  },
  arrow: {
    fontSize: 24,
    fontWeight: "500",
  },
});