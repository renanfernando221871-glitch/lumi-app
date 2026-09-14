import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LumiSpeechBubble } from "../components/LumiSpeechBubble";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>UM OLÁ BEM BONITO</Text>
          <View style={styles.lumiHero}>
            <Text style={styles.lumiHeroFace}>🌻</Text>
            <Text style={styles.sparkle}>✦</Text>
            <Text style={styles.sparkleTwo}>✦</Text>
          </View>
          <Text style={styles.heroTitle}>Oi! Eu sou a Lumi.</Text>
          <Text style={styles.heroSubtitle}>
            Vou descobrir o mundo com você.
          </Text>
          <LumiSpeechBubble>
            Aqui, cada descoberta vira uma sementinha de coragem!
          </LumiSpeechBubble>
          <PrimaryButton
            label="Vamos descobrir"
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
    paddingVertical: 22,
  },
  hero: {
    width: "100%",
    maxWidth: 530,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 24,
  },
  heroKicker: {
    color: colors.coral,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  lumiHero: {
    width: 176,
    height: 176,
    borderRadius: 88,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    backgroundColor: colors.yellow,
    borderWidth: 8,
    borderColor: colors.white,
    ...shadow,
  },
  lumiHeroFace: {
    fontSize: 101,
  },
  sparkle: {
    position: "absolute",
    top: 13,
    right: 5,
    color: colors.coral,
    fontSize: 34,
  },
  sparkleTwo: {
    position: "absolute",
    bottom: 23,
    left: 8,
    color: colors.blue,
    fontSize: 23,
  },
  heroTitle: {
    color: colors.deepGreen,
    fontSize: 34,
    lineHeight: 40,
    textAlign: "center",
    fontWeight: "900",
  },
  heroSubtitle: {
    color: colors.muted,
    fontSize: 17,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 22,
  },
  fullButton: {
    width: "100%",
    marginTop: 20,
  },
});