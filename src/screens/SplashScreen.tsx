import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

export function SplashScreen() {
  return (
    <Shell>
      <View style={styles.splash}>
        <View style={styles.sunBadge}>
          <Text style={styles.sun}>🌻</Text>
        </View>
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
  sunBadge: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
    ...shadow,
  },
  sun: {
    fontSize: 62,
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