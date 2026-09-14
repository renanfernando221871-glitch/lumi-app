import React, { useEffect, useState } from "react";
import * as Speech from "expo-speech";
import { Pressable, StyleSheet, Text } from "react-native";
import {
  createSpeechController,
  SpeechController,
} from "../audio/speechController";
import { colors } from "../theme/colors";

export function AudioButton({ label, text }: { label: string; text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [controller] = useState<SpeechController>(() =>
    createSpeechController(
      {
        stop: Speech.stop,
        speak: Speech.speak,
      },
      setIsPlaying,
    ),
  );

  useEffect(() => {
    return () => controller.dispose();
  }, [controller]);

  const handlePress = () => {
    void controller.play(text);
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