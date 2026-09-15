import React from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LumiCharacter } from "../components/LumiCharacter";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  onBack: () => void;
  onContinue: () => void;
};

type SafetyItemProps = {
  description: string;
  icon: ImageSourcePropType;
  title: string;
};

const roundedFont = Platform.select({
  ios: "Arial Rounded MT Bold",
  android: "sans-serif-rounded",
  web: "ui-rounded, Arial Rounded MT Bold, Trebuchet MS, sans-serif",
});

const safetyItems: SafetyItemProps[] = [
  {
    title: "Sem anúncios",
    description: "Uma experiência livre de publicidade para mais foco e tranquilidade.",
    icon: require("../../assets/images/onboarding/safety/no-ads.png"),
  },
  {
    title: "Conteúdo educativo",
    description: "Atividades que estimulam a curiosidade e o aprendizado.",
    icon: require("../../assets/images/onboarding/safety/education.png"),
  },
  {
    title: "Tempo de uso personalizável",
    description: "Você define os horários e o tempo de uso.",
    icon: require("../../assets/images/onboarding/safety/time.png"),
  },
  {
    title: "Acompanhamento da família",
    description: "Acompanhe o progresso e participe dessa jornada.",
    icon: require("../../assets/images/onboarding/safety/family.png"),
  },
];

export function SafetyScreen({ onBack, onContinue }: Props) {
  return (
    <Shell>
      <View style={styles.background}>
        <View style={[styles.cloud, styles.cloudLeft]} />
        <View style={[styles.cloud, styles.cloudRight]} />
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
        <View style={[styles.bush, styles.bushLeft]} />
        <View style={[styles.bush, styles.bushRight]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <View style={styles.back}>
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
          </View>

          <Image
            accessibilityLabel="Lumi — crescer é descobrir"
            resizeMode="contain"
            source={require("../../assets/images/lumi/lumi-logo-guardian.png")}
            style={styles.logo}
          />

          <View style={styles.greeting}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                Um lugar seguro para aprender e se divertir!
              </Text>
            </View>
            <LumiCharacter
              accessibilityLabel="Lumi, personagem oficial"
              expression="main"
              size="large"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Um ambiente seguro{"\n"}para explorar</Text>
          <Text style={styles.description}>
            Aqui, a diversão vem junto com aprendizado, tranquilidade e proteção.
          </Text>

          <View style={styles.items}>
            {safetyItems.map((item) => (
              <SafetyItem key={item.title} {...item} />
            ))}
          </View>

          <Text style={styles.controlText}>Você continua no controle.</Text>
          <View style={styles.controlUnderline} />

          <PrimaryButton
            label="Continuar"
            onPress={onContinue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </Shell>
  );
}

function SafetyItem({ description, icon, title }: SafetyItemProps) {
  return (
    <View style={styles.item}>
      <Image resizeMode="cover" source={icon} style={styles.itemIcon} />
      <View style={styles.itemCopy}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
    </View>
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
    width: 94,
    height: 45,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  cloudLeft: {
    left: "5%",
    top: "15%",
  },
  cloudRight: {
    right: "4%",
    top: "9%",
    transform: [{ scale: 0.75 }],
  },
  hillBack: {
    position: "absolute",
    width: "135%",
    height: "29%",
    left: "-38%",
    bottom: "-17%",
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
    transform: [{ rotate: "5deg" }],
  },
  hillFront: {
    position: "absolute",
    width: "135%",
    height: "27%",
    right: "-40%",
    bottom: "-17%",
    borderRadius: 999,
    backgroundColor: "#91D17A",
    transform: [{ rotate: "-5deg" }],
  },
  bush: {
    position: "absolute",
    bottom: "1%",
    width: 68,
    height: 45,
    borderRadius: 34,
    backgroundColor: "#68B968",
  },
  bushLeft: {
    left: "8%",
  },
  bushRight: {
    right: "8%",
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 52,
  },
  top: {
    width: "100%",
    maxWidth: 400,
    height: 255,
    alignItems: "center",
  },
  back: {
    position: "absolute",
    left: 0,
    top: 4,
    zIndex: 3,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  pressed: {
    opacity: 0.78,
  },
  backIcon: {
    color: "#123C84",
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "600",
    marginTop: -3,
  },
  logo: {
    width: 185,
    height: 86,
  },
  greeting: {
    position: "absolute",
    right: -9,
    bottom: -25,
    flexDirection: "row",
    alignItems: "center",
  },
  speechBubble: {
    width: 190,
    minHeight: 92,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: colors.white,
    ...shadow,
  },
  speechText: {
    color: colors.deepGreen,
    fontFamily: roundedFont,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    backgroundColor: colors.white,
    ...shadow,
  },
  title: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 29,
    lineHeight: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    maxWidth: 320,
    alignSelf: "center",
    color: "#334C78",
    fontSize: 15,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 12,
  },
  items: {
    gap: 8,
  },
  item: {
    width: "100%",
    minHeight: 72,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#F7F9FC",
  },
  itemIcon: {
    width: 78,
    height: 72,
  },
  itemCopy: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  itemTitle: {
    color: "#123C84",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "900",
  },
  itemDescription: {
    color: "#405473",
    fontSize: 12,
    lineHeight: 15,
    marginTop: 1,
  },
  controlText: {
    color: colors.deepGreen,
    fontFamily: roundedFont,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 13,
  },
  controlUnderline: {
    width: 90,
    height: 3,
    alignSelf: "center",
    borderRadius: 2,
    backgroundColor: "#69D8E2",
    marginTop: 5,
  },
  continueButton: {
    width: "100%",
    minHeight: 60,
    marginTop: 15,
  },
});