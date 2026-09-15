import React from "react";
import { Image, ImageSourcePropType, StyleSheet } from "react-native";

export type LumiExpression =
  | "main"
  | "curious"
  | "happy"
  | "encouraging"
  | "childIntro"
  | "celebrating";
export type LumiSize = "small" | "medium" | "large" | "hero";

type Props = {
  expression?: LumiExpression;
  size?: LumiSize;
  accessibilityLabel?: string;
};

const sources: Record<LumiExpression, ImageSourcePropType> = {
  main: require("../../assets/images/lumi/lumi-main.png"),
  curious: require("../../assets/images/lumi/lumi-curious.png"),
  happy: require("../../assets/images/lumi/lumi-happy.png"),
  encouraging: require("../../assets/images/lumi/lumi-gentle.png"),
  childIntro: require("../../assets/images/lumi/lumi-child-intro.png"),
  celebrating: require("../../assets/images/lumi/lumi-happy.png"),
};

const sizes = {
  small: { width: 52, height: 58 },
  medium: { width: 88, height: 96 },
  large: { width: 168, height: 178 },
  hero: { width: 300, height: 435 },
};

export function LumiCharacter({
  expression = "happy",
  size = "medium",
  accessibilityLabel = "Lumi",
}: Props) {
  return (
    <Image
      accessibilityLabel={accessibilityLabel}
      resizeMode="contain"
      source={sources[expression]}
      style={[styles.image, sizes[size]]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flexShrink: 0,
  },
});