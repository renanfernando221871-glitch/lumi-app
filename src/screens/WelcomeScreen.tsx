import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";
import { LumiCharacter } from "../components/LumiCharacter";

type Props = {
  onContinue: () => void;
  disabled?: boolean;
};

export function WelcomeScreen({ onContinue, disabled = false }: Props) {
  return (
    <Shell>
      <View style={styles.background}>
        <View style={styles.skyGlow} />
        <View style={[styles.cloud, styles.cloudLeft]}>
          <View style={[styles.cloudPuff, styles.cloudPuffSmall]} />
          <View style={[styles.cloudPuff, styles.cloudPuffLarge]} />
        </View>
        <View style={[styles.cloud, styles.cloudRight]}>
          <View style={[styles.cloudPuff, styles.cloudPuffSmall]} />
          <View style={[styles.cloudPuff, styles.cloudPuffLarge]} />
        </View>
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
        <View style={[styles.bush, styles.bushLeft]}>
          <View style={styles.bushTop} />
        </View>
        <View style={[styles.bush, styles.bushRight]}>
          <View style={styles.bushTop} />
        </View>
        <View style={[styles.flower, styles.flowerLeft]}>
          <View style={styles.flowerCenter} />
        </View>
        <View style={[styles.flower, styles.flowerRight]}>
          <View style={styles.flowerCenter} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <View accessibilityLabel="Logomarca Lumi" style={styles.brand}>
            <Text style={styles.brandName}>lumi</Text>
            <Text style={styles.brandTagline}>crescer é descobrir</Text>
          </View>
          <View style={styles.lumiHero}>
            <View style={styles.softCircle} />
            <View style={styles.smallCircle} />
            <LumiCharacter
              accessibilityLabel="Lumi, personagem oficial"
              expression="main"
              size="large"
            />
          </View>
          <Text style={styles.heroTitle}>Bem-vindo!</Text>
          <Text style={styles.heroSubtitle}>
            Aprender também pode ser uma grande aventura!
          </Text>
          <PrimaryButton
            disabled={disabled}
            label="Começar"
            onPress={onContinue}
            variant="green"
            style={styles.fullButton}
          />
        </View>
      </ScrollView>
    </Shell>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    overflow: "hidden",
    backgroundColor: "#DDF3FF",
  },
  skyGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "58%",
    backgroundColor: "#ECF8FF",
    opacity: 0.78,
  },
  cloud: {
    position: "absolute",
    width: 86,
    height: 30,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  cloudLeft: {
    top: "13%",
    left: "8%",
  },
  cloudRight: {
    top: "20%",
    right: "9%",
    transform: [{ scale: 0.78 }],
  },
  cloudPuff: {
    position: "absolute",
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  cloudPuffSmall: {
    width: 34,
    height: 34,
    left: 12,
    top: -13,
  },
  cloudPuffLarge: {
    width: 45,
    height: 45,
    right: 10,
    top: -21,
  },
  hillBack: {
    position: "absolute",
    width: "125%",
    height: "38%",
    left: "-34%",
    bottom: "-19%",
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
    transform: [{ rotate: "4deg" }],
  },
  hillFront: {
    position: "absolute",
    width: "130%",
    height: "34%",
    right: "-39%",
    bottom: "-18%",
    borderRadius: 999,
    backgroundColor: "#91D17A",
    transform: [{ rotate: "-5deg" }],
  },
  bush: {
    position: "absolute",
    bottom: "5%",
    width: 70,
    height: 40,
    borderRadius: 35,
    backgroundColor: "#68B968",
  },
  bushTop: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    left: 14,
    top: -18,
    backgroundColor: "#78C776",
  },
  bushLeft: {
    left: "7%",
  },
  bushRight: {
    right: "8%",
    transform: [{ scale: 0.82 }],
  },
  flower: {
    position: "absolute",
    bottom: "11%",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F9A8A0",
    borderWidth: 6,
    borderColor: "#FFD47A",
  },
  flowerCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 3,
    backgroundColor: "#ECA53A",
  },
  flowerLeft: {
    left: "21%",
  },
  flowerRight: {
    right: "21%",
    bottom: "8%",
    transform: [{ scale: 0.75 }],
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 28,
  },
  hero: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  brand: {
    alignItems: "center",
    marginBottom: 14,
  },
  brandName: {
    color: colors.deepGreen,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1.8,
    lineHeight: 48,
  },
  brandTagline: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "800",
    marginTop: -2,
  },
  lumiHero: {
    width: 230,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  softCircle: {
    position: "absolute",
    width: 205,
    height: 205,
    borderRadius: 103,
    backgroundColor: colors.softYellow,
    borderWidth: 7,
    borderColor: colors.white,
    ...shadow,
  },
  smallCircle: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    right: 5,
    top: 22,
    backgroundColor: colors.softCoral,
  },
  heroTitle: {
    color: colors.deepGreen,
    fontSize: 38,
    lineHeight: 44,
    textAlign: "center",
    fontWeight: "900",
  },
  heroSubtitle: {
    maxWidth: 360,
    color: colors.ink,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  fullButton: {
    width: "100%",
    maxWidth: 360,
    minHeight: 64,
    borderRadius: 24,
    marginTop: 28,
  },
});