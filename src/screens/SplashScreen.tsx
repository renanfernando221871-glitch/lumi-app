import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Shell } from "./components/Shell";
import { LumiCharacter } from "../components/LumiCharacter";

export function SplashScreen() {
  return (
    <Shell>
      <View style={styles.splash}>
        <LumiCharacter expression="main" size="large" />
        <Text style={styles.brand}>lumi</Text>
        <Text style={styles.splashTagline}>crescer é descobrir</Text>
        <View style={styles.loadingDots}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotActive]} />
          <View style={styles.loadingDot} />
        </View>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
  },
  brand: {
    color: colors.deepGreen,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
    marginTop: 18,
  },
  splashTagline: {
    color: colors.green,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 7,
    marginTop: 36,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  loadingDotActive: {
    backgroundColor: colors.green,
  },
});