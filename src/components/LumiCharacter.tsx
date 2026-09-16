import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
} from "react-native";

export type LumiExpression =
  | "main"
  | "curious"
  | "happy"
  | "encouraging"
  | "welcome"
  | "childIntro"
  | "celebrating";
export type LumiSize = "small" | "medium" | "large" | "medallion" | "hero";

type Props = {
  expression?: LumiExpression;
  size?: LumiSize;
  accessibilityLabel?: string;
  style?: ImageStyle;
};

const sources: Record<LumiExpression, ImageSourcePropType> = {
  main: require("../../assets/images/lumi/lumi-child-intro.png"),
  curious: require("../../assets/images/lumi/lumi-curious.png"),
  happy: require("../../assets/images/lumi/lumi-happy.png"),
  encouraging: require("../../assets/images/lumi/lumi-gentle.png"),
  welcome: require("../../assets/images/lumi/lumi-welcome-medallion.png"),
  childIntro: require("../../assets/images/lumi/lumi-child-intro-open-arms.png"),
  celebrating: require("../../assets/images/lumi/lumi-happy.png"),
};

const sizes = {
  small: { width: 52, height: 58 },
  medium: { width: 88, height: 96 },
  large: { width: 168, height: 178 },
  medallion: { width: 250, height: 250 },
  hero: { width: 350, height: 475 },
};

export function LumiCharacter({
  expression = "happy",
  size = "medium",
  accessibilityLabel = "Lumi",
  style,
}: Props) {
  return (
    <Image
      accessibilityLabel={accessibilityLabel}
      resizeMode="contain"
      source={sources[expression]}
      style={[styles.image, sizes[size], style]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flexShrink: 0,
  },
});