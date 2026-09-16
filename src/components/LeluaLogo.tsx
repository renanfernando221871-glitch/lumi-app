import React from "react";
import { Image, ImageStyle, StyleSheet } from "react-native";

type Props = {
  compact?: boolean;
  accessibilityLabel?: string;
  style?: ImageStyle;
};

export function LeluaLogo({
  compact = false,
  accessibilityLabel = "Leluá — crescer é descobrir",
  style,
}: Props) {
  return (
    <Image
      accessibilityLabel={accessibilityLabel}
      resizeMode="contain"
      source={require("../../assets/images/lelua-logo.png")}
      style={[styles.logo, compact && styles.compactLogo, style]}
    />
  );
}

const styles = StyleSheet.create({
  logo: { width: 320, height: 142 },
  compactLogo: { width: 220, height: 98 },
});