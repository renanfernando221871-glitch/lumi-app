import React, { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

export function AudioButton({ label }: { label: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 900);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={handlePress}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.72 : 1 }]}
    >
      <Text style={styles.icon}>{isPlaying ? "🔊" : "🔈"}</Text>
      <Text style={styles.label}>{isPlaying ? "Ouvindo..." : "Ouvir"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    minHeight: 42,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.softBlue,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: "800",
  },
});