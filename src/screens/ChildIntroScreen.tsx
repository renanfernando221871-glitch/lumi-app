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

export function ChildIntroScreen({ childName: _childName, onBack, onContinue }: Props) {
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

        <View style={styles.characterStage}>
          <LumiCharacter
            accessibilityLabel="Lumi, personagem oficial"
            expression="childIntro"
            size="hero"
          />
          <Text style={[styles.ray, styles.rayLeft]}>››</Text>
          <Text style={[styles.ray, styles.rayRight]}>››</Text>
        </View>

        <View style={styles.copy}>
          <View style={styles.helloRow}>
            <Text style={[styles.ray, styles.helloRayLeft]}>››</Text>
            <Text style={styles.hello}>Olá!</Text>
            <Text style={[styles.ray, styles.helloRayRight]}>‹‹</Text>
          </View>
          <Text style={styles.title}>
            Eu sou a <Text style={styles.lumiWord}>Lumi</Text>!
          </Text>
          <Text style={styles.subtitle}>
            Vamos explorar, brincar e descobrir?
          </Text>

          <Pressable
            accessibilityLabel="Vamos lá!"
            accessibilityRole="button"
            onPress={onContinue}
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>Vamos lá!</Text>
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
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  cloudLeft: { left: "-8%", top: "22%" },
  cloudRight: { right: "-9%", top: "20%" },
  hillBack: {
    position: "absolute",
    width: "140%",
    height: "18%",
    left: "-38%",
    bottom: "-10%",
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
  },
  hillFront: {
    position: "absolute",
    width: "145%",
    height: "17%",
    right: "-40%",
    bottom: "-9%",
    borderRadius: 999,
    backgroundColor: "#87CE72",
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  backButton: {
    position: "absolute",
    top: 22,
    left: 20,
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
  logo: { width: 184, height: 92 },
  characterStage: {
    width: "100%",
    maxWidth: 400,
    height: 435,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ray: {
    position: "absolute",
    color: "#FFBE31",
    fontFamily: roundedFont,
    fontSize: 32,
    fontWeight: "900",
  },
  rayLeft: { left: 68, top: 254, transform: [{ rotate: "21deg" }] },
  rayRight: { right: 56, top: 165, transform: [{ rotate: "-20deg" }] },
  copy: { width: "100%", maxWidth: 400, alignItems: "center", marginTop: -14 },
  helloRow: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  hello: {
    color: "#2765B1",
    fontFamily: roundedFont,
    fontSize: 50,
    lineHeight: 54,
    fontWeight: "900",
  },
  helloRayLeft: { position: "relative", fontSize: 25, marginRight: 11, transform: [{ rotate: "54deg" }] },
  helloRayRight: { position: "relative", fontSize: 25, marginLeft: 11, transform: [{ rotate: "-54deg" }] },
  title: {
    color: "#2765B1",
    fontFamily: roundedFont,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "900",
    textAlign: "center",
  },
  lumiWord: { color: "#F17C68" },
  subtitle: {
    color: "#24508A",
    fontFamily: roundedFont,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },
  continueButton: {
    width: "90%",
    minHeight: 70,
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    backgroundColor: "#63C76A",
    ...shadow,
  },
  continueText: {
    color: colors.white,
    fontFamily: roundedFont,
    fontSize: 28,
    fontWeight: "900",
  },
  continueArrow: {
    position: "absolute",
    right: 24,
    color: colors.white,
    fontSize: 39,
    lineHeight: 41,
    fontWeight: "800",
  },
});