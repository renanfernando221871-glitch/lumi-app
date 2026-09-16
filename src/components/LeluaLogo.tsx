import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";

const roundedFont = Platform.select({
  ios: "Arial Rounded MT Bold",
  android: "sans-serif-rounded",
  web: "ui-rounded, Arial Rounded MT Bold, Trebuchet MS, sans-serif",
});

type Props = {
  compact?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function LeluaLogo({
  compact = false,
  accessibilityLabel = "Leluá — crescer é descobrir",
  style,
}: Props) {
  return (
    <View accessibilityLabel={accessibilityLabel} style={[styles.wrap, style]}>
      <Text style={[styles.word, compact && styles.compactWord]}>
        <Text style={styles.blue}>L</Text>
        <Text style={styles.yellow}>e</Text>
        <Text style={styles.coral}>l</Text>
        <Text style={styles.pink}>u</Text>
        <Text style={styles.green}>á</Text>
      </Text>
      <Text style={[styles.tagline, compact && styles.compactTagline]}>
        crescer é descobrir
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  word: {
    fontFamily: roundedFont,
    fontSize: 64,
    lineHeight: 65,
    fontWeight: "900",
    letterSpacing: -5,
  },
  compactWord: { fontSize: 47, lineHeight: 48 },
  blue: { color: "#2789E8" },
  yellow: { color: "#F4B52E" },
  coral: { color: "#F27668" },
  pink: { color: "#F06D83" },
  green: { color: "#39AD67" },
  tagline: {
    color: "#19845D",
    fontFamily: roundedFont,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "800",
    marginTop: -2,
  },
  compactTagline: { fontSize: 12, lineHeight: 14 },
});