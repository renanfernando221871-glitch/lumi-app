import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, shadow } from "../theme/colors";

export type LumiExpression =
  | "curious"
  | "happy"
  | "encouraging"
  | "celebrating";
export type LumiSize = "small" | "medium" | "large";

type Props = {
  expression?: LumiExpression;
  size?: LumiSize;
  accessibilityLabel?: string;
};

const sizes = { small: 48, medium: 84, large: 154 };

export function LumiCharacter({
  expression = "happy",
  size = "medium",
  accessibilityLabel = "Lumi",
}: Props) {
  const diameter = sizes[size];
  const petal = Math.max(8, diameter * 0.18);
  const eye = Math.max(3, diameter * 0.055);
  const mouthWidth = diameter * 0.22;
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.root, { width: diameter, height: diameter * 1.12 }]}
    >
      <View style={[styles.petal, { width: petal, height: petal, top: diameter * 0.08 }]} />
      <View style={[styles.petal, { width: petal, height: petal, left: diameter * 0.06, top: diameter * 0.22 }]} />
      <View style={[styles.petal, { width: petal, height: petal, right: diameter * 0.06, top: diameter * 0.22 }]} />
      <View style={[styles.petal, { width: petal, height: petal, bottom: diameter * 0.25 }]} />
      <View style={[styles.face, { width: diameter * 0.72, height: diameter * 0.72, borderRadius: diameter * 0.36, top: diameter * 0.17 }]}>
        <View style={styles.bowLeft} />
        <View style={styles.bowRight} />
        <View style={[styles.eye, { width: eye, height: eye, borderRadius: eye / 2, left: "31%" }, expression === "curious" && styles.curiousEye]} />
        <View style={[styles.eye, { width: eye, height: eye, borderRadius: eye / 2, right: "31%" }, expression === "curious" && styles.curiousEye]} />
        <View
          style={[
            styles.mouth,
            { width: mouthWidth, height: diameter * 0.12, borderBottomLeftRadius: mouthWidth, borderBottomRightRadius: mouthWidth },
            expression === "curious" && styles.curiousMouth,
            expression === "encouraging" && styles.encouragingMouth,
          ]}
        />
        {expression === "celebrating" ? <View style={[styles.cheek, styles.cheekLeft]} /> : null}
        {expression === "celebrating" ? <View style={[styles.cheek, styles.cheekRight]} /> : null}
      </View>
      <View style={[styles.body, { width: diameter * 0.46, height: diameter * 0.28, borderRadius: diameter * 0.18 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "flex-end", position: "relative" },
  petal: { position: "absolute", alignSelf: "center", borderRadius: 99, backgroundColor: colors.coral, opacity: 0.95 },
  face: { position: "absolute", alignItems: "center", justifyContent: "center", backgroundColor: colors.yellow, borderWidth: 3, borderColor: colors.white, ...shadow },
  eye: { position: "absolute", top: "38%", backgroundColor: colors.deepGreen },
  curiousEye: { top: "34%" },
  mouth: { position: "absolute", top: "56%", borderBottomWidth: 3, borderColor: colors.deepGreen },
  curiousMouth: { width: 7, height: 7, borderWidth: 2, borderRadius: 8, borderBottomWidth: 2, backgroundColor: "transparent" },
  encouragingMouth: { transform: [{ scaleX: 0.8 }] },
  cheek: { position: "absolute", top: "55%", width: "11%", height: "6%", borderRadius: 99, backgroundColor: colors.softCoral },
  cheekLeft: { left: "14%" },
  cheekRight: { right: "14%" },
  body: { backgroundColor: colors.green, borderWidth: 3, borderColor: colors.white, ...shadow },
  bowLeft: { position: "absolute", top: "-7%", left: "19%", width: "24%", height: "17%", borderRadius: 99, backgroundColor: colors.coral, transform: [{ rotate: "-24deg" }] },
  bowRight: { position: "absolute", top: "-7%", right: "19%", width: "24%", height: "17%", borderRadius: 99, backgroundColor: colors.coral, transform: [{ rotate: "24deg" }] },
});