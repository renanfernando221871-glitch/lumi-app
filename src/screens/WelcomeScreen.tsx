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