import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LeluaLogo } from "../components/LeluaLogo";
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

const roundedFont = "Fredoka_700Bold";

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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
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

          <LeluaLogo compact style={styles.logo} />

          <View style={styles.greeting}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                <Text style={styles.speechLead}>Um lugar </Text>
                <Text style={styles.speechHighlight}>seguro</Text>
                {"\n"}
                <Text style={styles.speechLead}>para aprender e se</Text>
                {"\n"}
                <Text style={styles.speechAccent}>divertir!</Text>
              </Text>
              <View style={styles.speechTail} />
              <View style={[styles.speechSpark, styles.speechSparkTop]} />
              <View style={[styles.speechSpark, styles.speechSparkMiddle]} />
              <View style={[styles.speechSpark, styles.speechSparkBottom]} />
            </View>
            <LumiCharacter
              accessibilityLabel="Leluá, personagem oficial"
              expression="main"
              size="large"
              style={styles.greetingCharacter}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            Um ambiente{"\n"}
            <Text style={styles.titleHighlight}>seguro</Text>
            {"\n"}para explorar
          </Text>
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
            textStyle={styles.buttonText}
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
    left: -20,
    top: "18%",
  },
  cloudRight: {
    right: -24,
    top: "13%",
    transform: [{ scale: 0.64 }],
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
    paddingBottom: 58,
  },
  top: {
    width: "100%",
    maxWidth: 400,
    height: 230,
    alignItems: "center",
    position: "relative",
    overflow: "visible",
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
    width: 210,
    height: 94,
  },
  greeting: {
    position: "absolute",
    right: 0,
    bottom: -22,
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "visible",
  },
  speechBubble: {
    width: 190,
    minHeight: 98,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 39,
    borderBottomLeftRadius: 28,
    borderWidth: 2,
    borderColor: "#F7FCFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    marginTop: 30,
    marginRight: -8,
    zIndex: 1,
    overflow: "visible",
    transform: [{ rotate: "-2.5deg" }],
    ...shadow,
  },
  speechTail: {
    position: "absolute",
    right: -8,
    top: 35,
    width: 21,
    height: 21,
    borderBottomRightRadius: 7,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#F7FCFF",
    backgroundColor: colors.white,
    transform: [{ rotate: "45deg" }],
    zIndex: 1,
  },
  speechText: {
    fontFamily: roundedFont,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    textAlign: "center",
    transform: [{ rotate: "2.5deg" }],
    zIndex: 2,
  },
  speechLead: {
    color: "#123C84",
  },
  speechHighlight: {
    color: "#2FAE67",
    fontWeight: "700",
  },
  speechAccent: {
    color: "#168AC5",
    fontSize: 17,
    fontWeight: "700",
  },
  speechSpark: {
    position: "absolute",
    left: -11,
    width: 10,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#F6C945",
  },
  speechSparkTop: {
    top: 27,
    transform: [{ rotate: "28deg" }],
  },
  speechSparkMiddle: {
    top: 44,
    left: -14,
  },
  speechSparkBottom: {
    top: 61,
    transform: [{ rotate: "-28deg" }],
  },
  greetingCharacter: {
    width: 150,
    height: 160,
    zIndex: 2,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 24,
    backgroundColor: colors.white,
    ...shadow,
  },
  title: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 30,
    lineHeight: 33,
    fontWeight: "700",
    textAlign: "center",
  },
  titleHighlight: {
    color: "#168AC5",
  },
  description: {
    maxWidth: 320,
    alignSelf: "center",
    color: "#334C78",
    fontFamily: "Nunito_500Medium",
    fontSize: 15,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 12,
  },
  items: {
    gap: 9,
  },
  item: {
    width: "100%",
    height: 84,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#EEF8FF",
  },
  itemIcon: {
    width: 84,
    height: 84,
  },
  itemCopy: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  itemTitle: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
  },
  itemDescription: {
    color: "#405473",
    fontFamily: "Nunito_400Regular",
    fontSize: 12.5,
    lineHeight: 16,
    marginTop: 2,
  },
  controlText: {
    color: colors.deepGreen,
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 13,
  },
  controlUnderline: {
    width: 76,
    height: 3,
    alignSelf: "center",
    borderRadius: 2,
    backgroundColor: "#42B86B",
    marginTop: 5,
    transform: [{ rotate: "-2deg" }],
  },
  continueButton: {
    width: "100%",
    minHeight: 64,
    marginTop: 15,
  },
  buttonText: {
    fontFamily: roundedFont,
  },
});