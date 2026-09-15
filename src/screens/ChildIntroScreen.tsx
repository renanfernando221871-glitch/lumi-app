import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LumiCharacter } from "../components/LumiCharacter";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  childName: string;
  onBack: () => void;
  onContinue: () => void;
};

const roundedFont = Platform.select({
  ios: "Arial Rounded MT Bold",
  android: "sans-serif-rounded",
  web: "ui-rounded, Arial Rounded MT Bold, Trebuchet MS, sans-serif",
});

export function ChildIntroScreen({ childName, onBack, onContinue }: Props) {
  return (
    <Shell>
      <View style={styles.background}>
        <View style={[styles.cloud, styles.cloudLeft]} />
        <View style={[styles.cloud, styles.cloudRight]} />
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable
          accessibilityLabel="Voltar para a área do responsável"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Image
          accessibilityLabel="Lumi — crescer é descobrir"
          resizeMode="contain"
          source={require("../../assets/images/lumi/lumi-logo-guardian.png")}
          style={styles.logo}
        />

        <View style={styles.card}>
          <View style={styles.sparkleLeft}><Text style={styles.sparkle}>★</Text></View>
          <View style={styles.sparkleRight}><Text style={styles.sparkle}>★</Text></View>
          <LumiCharacter
            accessibilityLabel="Lumi, personagem oficial"
            expression="main"
            size="large"
          />
          <Text style={styles.title}>Olá! Eu sou a Lumi!</Text>
          <Text style={styles.subtitle}>
            {childName
              ? `${childName}, vamos explorar, brincar e descobrir juntos?`
              : "Vamos explorar, brincar e descobrir juntos?"}
          </Text>

          <Pressable
            accessibilityLabel="Começar a explorar"
            accessibilityRole="button"
            onPress={onContinue}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>Vamos explorar!</Text>
            <Text style={styles.continueArrow}>›</Text>
          </Pressable>
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
  cloud: {
    position: "absolute",
    width: 105,
    height: 44,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.84)",
  },
  cloudLeft: { left: "-4%", top: "16%" },
  cloudRight: { right: "-4%", top: "9%" },
  hillBack: {
    position: "absolute",
    width: "140%",
    height: "28%",
    left: "-42%",
    bottom: "-14%",
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
  },
  hillFront: {
    position: "absolute",
    width: "145%",
    height: "26%",
    right: "-45%",
    bottom: "-14%",
    borderRadius: 999,
    backgroundColor: "#87CE72",
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  backButton: {
    position: "absolute",
    top: 24,
    left: 22,
    zIndex: 2,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  backIcon: { color: "#123C84", fontSize: 38, lineHeight: 39 },
  logo: { width: 175, height: 82, marginBottom: 6 },
  card: {
    width: "100%",
    maxWidth: 390,
    minHeight: 590,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.94)",
    ...shadow,
  },
  sparkleLeft: { position: "absolute", left: 34, top: 95, transform: [{ rotate: "-15deg" }] },
  sparkleRight: { position: "absolute", right: 38, top: 150, transform: [{ rotate: "12deg" }] },
  sparkle: { color: "#FFD34D", fontSize: 28 },
  title: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    maxWidth: 290,
    color: "#405473",
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 10,
  },
  continueButton: {
    width: "100%",
    minHeight: 62,
    borderRadius: 31,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    backgroundColor: "#63C76A",
    ...shadow,
  },
  continueText: {
    color: colors.white,
    fontFamily: roundedFont,
    fontSize: 19,
    fontWeight: "900",
  },
  continueArrow: { color: colors.white, fontSize: 32, lineHeight: 34, marginLeft: 10 },
});