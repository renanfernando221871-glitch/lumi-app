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
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  childName: string;
  completedActivities: number;
  totalActivities: number;
  onOpenChildMode: () => void;
  onOpenActivities: () => void;
};

type Shortcut = {
  label: string;
  icon: ImageSourcePropType;
  color: string;
  onPress?: () => void;
};

type IconFrameProps = {
  icon: ImageSourcePropType;
  imageStyle: "summary" | "shortcut";
};

const roundedFont = "Fredoka_700Bold";
const bodyFont = "Nunito_400Regular";
const bodyMediumFont = "Nunito_500Medium";

export function GuardianHomeScreen({
  childName,
  completedActivities,
  totalActivities,
  onOpenChildMode,
  onOpenActivities,
}: Props) {
  const progressPercent =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;
  const shortcuts: Shortcut[] = [
    {
      label: "Atividades",
      icon: require("../../assets/images/onboarding/guardian-home/activities-framed.png"),
      color: "#E5F8E7",
      onPress: onOpenActivities,
    },
    {
      label: "Biblioteca",
      icon: require("../../assets/images/onboarding/guardian-home/library.png"),
      color: "#FFE9F0",
    },
    {
      label: "Relatórios",
      icon: require("../../assets/images/onboarding/guardian-home/reports.png"),
      color: "#F0E7FF",
    },
    {
      label: "Configurações",
      icon: require("../../assets/images/onboarding/guardian-home/settings-framed.png"),
      color: "#E8F6FF",
    },
  ];

  return (
    <Shell>
      <View style={styles.background}>
        <View style={[styles.cloud, styles.cloudLeft]} />
        <View style={[styles.cloud, styles.cloudRight]} />
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
        <View style={[styles.groundLeaf, styles.groundLeafLeft]} />
        <View style={[styles.groundLeaf, styles.groundLeafCenter]} />
        <View style={[styles.groundLeaf, styles.groundLeafRight]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Abrir menu"
            accessibilityRole="button"
            style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
          >
            <View style={styles.menuIcon}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </Pressable>
          <LeluaLogo compact style={styles.logo} />
          <Pressable
            accessibilityLabel="Ver notificações"
            accessibilityRole="button"
            style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
          >
            <View style={styles.notificationBell}>
              <View style={styles.bellDome} />
              <View style={styles.bellLip} />
              <View style={styles.bellClapper} />
            </View>
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <View style={styles.greetingRow}>
          <View style={styles.greetingCopy}>
            <View
              accessibilityLabel="Olá, responsável!"
              accessibilityRole="header"
              style={styles.greetingTitle}
            >
              <Text style={styles.greeting}>Olá,</Text>
              <Text numberOfLines={1} style={styles.greeting}>
                responsável!
              </Text>
            </View>
            <Text style={styles.greetingSub}>
              Aqui está o resumo da jornada de {childName || "seu pequeno"} hoje.
            </Text>
          </View>
          <LumiCharacter
            accessibilityLabel="Leluá, personagem oficial"
            expression="main"
            size="large"
            style={styles.lumi}
          />
        </View>

        <View style={styles.dashboardCard}>
          <Pressable
            accessibilityLabel="Abrir atividades: hoje é um ótimo dia para aprender"
            accessibilityRole="button"
            onPress={onOpenActivities}
            style={({ pressed }) => [styles.learningCard, pressed && styles.pressed]}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/images/onboarding/safety/education.png")}
              style={styles.learningIcon}
            />
            <View style={styles.learningCopy}>
              <Text style={styles.learningTitle}>
                Hoje é um ótimo dia para aprender!
              </Text>
              <Text style={styles.learningText}>
                Conhecimento, diversão e descobertas esperam por você.
              </Text>
            </View>
            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityLabel="Entrar no modo criança"
            accessibilityRole="button"
            onPress={onOpenChildMode}
            style={({ pressed }) => [
              styles.childModeButton,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.childModeIconCircle}>
              <Text style={styles.childModeIcon}>★</Text>
            </View>
            <View style={styles.childModeCopy}>
              <Text style={styles.childModeTitle}>Entrar no modo criança</Text>
              <Text style={styles.childModeText}>Explorar, brincar e descobrir</Text>
            </View>
            <Text style={styles.childModeArrow}>›</Text>
          </Pressable>

          <View accessibilityLabel="Resumo diário" style={styles.statsRow}>
            <StatCard
              color="#E1F5FF"
              icon={require("../../assets/images/onboarding/guardian-home/time-framed.png")}
              label="Tempo de uso"
              sublabel="de 2h por dia"
              value="1h 20min"
            />
            <StatCard
              color="#FFF1C7"
              icon={require("../../assets/images/onboarding/guardian-home/star-framed.png")}
              label="Atividades realizadas"
              sublabel="hoje"
              value={String(completedActivities)}
            />
            <StatCard
              color="#EEE3FF"
              icon={require("../../assets/images/onboarding/guardian-home/progress.png")}
              label="Progresso"
              sublabel={progressPercent ? `${progressPercent}% concluído` : "Continue assim!"}
              value={progressPercent ? "Muito bom!" : "Vamos começar!"}
            />
          </View>

          <Text style={styles.sectionTitle}>Acesso rápido</Text>
          <View style={styles.shortcuts}>
            {shortcuts.map((shortcut) => (
              <ShortcutCard key={shortcut.label} {...shortcut} />
            ))}
          </View>
        </View>
      </ScrollView>
    </Shell>
  );
}

function StatCard({
  color,
  icon,
  label,
  sublabel,
  value,
}: {
  color: string;
  icon: ImageSourcePropType;
  label: string;
  sublabel: string;
  value: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <IconFrame icon={icon} imageStyle="summary" />
      <Text style={styles.statLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.statValue}>{value}</Text>
      <Text numberOfLines={1} style={styles.statSub}>{sublabel}</Text>
    </View>
  );
}

function ShortcutCard({ color, icon, label, onPress }: Shortcut) {
  return (
    <Pressable
      accessibilityLabel={`Abrir ${label}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.shortcut,
        { backgroundColor: color },
        pressed && styles.pressed,
      ]}
    >
      <IconFrame icon={icon} imageStyle="shortcut" />
      <Text
        numberOfLines={1}
        style={styles.shortcutLabel}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function IconFrame({ icon, imageStyle }: IconFrameProps) {
  const summary = imageStyle === "summary";

  return (
    <View style={summary ? styles.statIconFrame : styles.shortcutIconFrame}>
      <Image
        resizeMode="contain"
        source={icon}
        style={summary ? styles.statIcon : styles.shortcutIcon}
      />
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
    width: 95,
    height: 43,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  cloudLeft: { left: "4%", top: "14%" },
  cloudRight: { right: "2%", top: "9%" },
  hillBack: {
    position: "absolute",
    width: "140%",
    height: 108,
    left: "-40%",
    bottom: -55,
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
  },
  hillFront: {
    position: "absolute",
    width: "140%",
    height: 100,
    right: "-42%",
    bottom: -52,
    borderRadius: 999,
    backgroundColor: "#87CE72",
  },
  groundLeaf: {
    position: "absolute",
    bottom: 9,
    width: 13,
    height: 29,
    borderTopLeftRadius: 13,
    borderBottomRightRadius: 13,
    backgroundColor: "#4DAE5D",
  },
  groundLeafLeft: { left: 34, transform: [{ rotate: "-34deg" }] },
  groundLeafCenter: { left: "49%", transform: [{ rotate: "18deg" }] },
  groundLeafRight: { right: 31, transform: [{ rotate: "36deg" }] },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 44,
    paddingBottom: 36,
  },
  header: {
    width: "100%",
    maxWidth: 400,
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roundButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "visible",
    backgroundColor: colors.white,
    ...shadow,
  },
  pressed: { opacity: 0.76 },
  menuIcon: { width: 23, gap: 5 },
  menuLine: {
    width: 23,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#123C84",
  },
  notificationBell: {
    width: 22,
    height: 25,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "visible",
  },
  bellDome: {
    width: 15,
    height: 16,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: "#123C84",
  },
  bellLip: {
    width: 21,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#123C84",
  },
  bellClapper: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 1,
    backgroundColor: "#123C84",
  },
  notificationDot: {
    position: "absolute",
    right: 5,
    top: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.coral,
  },
  logo: { width: 190, height: 85 },
  greetingRow: {
    width: "100%",
    maxWidth: 400,
    minHeight: 166,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  greetingTitle: {
    alignItems: "flex-start",
  },
  greeting: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "700",
  },
  greetingSub: {
    color: "#405473",
    fontFamily: bodyMediumFont,
    fontSize: 16,
    lineHeight: 21,
    marginTop: 8,
  },
  lumi: { width: 148, height: 164 },
  dashboardCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 32,
    padding: 14,
    backgroundColor: colors.white,
    ...shadow,
  },
  learningCard: {
    minHeight: 112,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#EAF9E5",
  },
  learningIcon: { width: 70, height: 70, marginRight: 8 },
  learningCopy: { flex: 1, minWidth: 0 },
  learningTitle: {
    color: colors.deepGreen,
    fontFamily: roundedFont,
    fontSize: 17,
    lineHeight: 20,
    fontWeight: "700",
  },
  learningText: {
    color: "#355E4B",
    fontFamily: bodyFont,
    fontSize: 13,
    lineHeight: 17,
    marginTop: 4,
  },
  arrowCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  arrow: { color: colors.green, fontSize: 29, lineHeight: 31 },
  childModeButton: {
    minHeight: 84,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 12,
    backgroundColor: "#63C76A",
    ...shadow,
  },
  childModeIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1A8",
  },
  childModeIcon: { color: "#F2A81D", fontSize: 33, lineHeight: 36 },
  childModeCopy: { flex: 1, paddingHorizontal: 10 },
  childModeTitle: {
    color: colors.white,
    fontFamily: roundedFont,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "700",
  },
  childModeText: {
    color: "#F2FFF3",
    fontFamily: bodyFont,
    fontSize: 13,
    lineHeight: 18,
  },
  childModeArrow: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "600",
  },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  statCard: {
    flex: 1,
    minWidth: 0,
    height: 150,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  statIconFrame: {
    width: 48,
    height: 48,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    overflow: "visible",
  },
  statIcon: { width: 42, height: 42, flexShrink: 0 },
  statLabel: {
    minHeight: 34,
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  statValue: {
    maxWidth: "100%",
    minHeight: 34,
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  statSub: {
    color: "#405473",
    fontFamily: bodyFont,
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: "auto",
    textAlign: "center",
  },
  sectionTitle: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  shortcuts: { flexDirection: "row", gap: 8 },
  shortcut: {
    flex: 1,
    minWidth: 0,
    height: 88,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutIconFrame: {
    width: 50,
    height: 46,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  shortcutIcon: { width: 43, height: 43, flexShrink: 0 },
  shortcutLabel: {
    maxWidth: "100%",
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: "700",
    textAlign: "center",
    minHeight: 13,
    marginTop: 5,
  },
});