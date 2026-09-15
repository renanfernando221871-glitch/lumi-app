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

const roundedFont = Platform.select({
  ios: "Arial Rounded MT Bold",
  android: "sans-serif-rounded",
  web: "ui-rounded, Arial Rounded MT Bold, Trebuchet MS, sans-serif",
});

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
      icon: require("../../assets/images/onboarding/guardian-home/activities.png"),
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
      icon: require("../../assets/images/onboarding/guardian-home/settings.png"),
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
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Abrir menu"
            style={[styles.roundButton, styles.menuButton]}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          <Image
            accessibilityLabel="Lumi — crescer é descobrir"
            resizeMode="contain"
            source={require("../../assets/images/lumi/lumi-logo-guardian.png")}
            style={styles.logo}
          />
          <Pressable
            accessibilityLabel="Ver notificações"
            style={[styles.roundButton, styles.notificationButton]}
          >
            <Image
              resizeMode="cover"
              source={require("../../assets/images/onboarding/guardian-home/notification.png")}
              style={styles.notificationIcon}
            />
          </Pressable>

          <View style={styles.greetingCopy}>
            <Text style={styles.greeting}>Olá, responsável!</Text>
            <Text style={styles.greetingSub}>
              Aqui está o resumo da jornada de {childName || "seu pequeno"} hoje.
            </Text>
          </View>
          <View style={styles.lumi}>
            <LumiCharacter
              accessibilityLabel="Lumi, personagem oficial"
              expression="main"
              size="large"
            />
          </View>
        </View>

        <View style={styles.dashboardCard}>
          <Pressable onPress={onOpenActivities} style={styles.learningCard}>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/onboarding/safety/education.png")}
              style={styles.learningIcon}
            />
            <View style={styles.learningCopy}>
              <Text style={styles.learningTitle}>
                Hoje é um ótimo dia{"\n"}para aprender!
              </Text>
              <Text style={styles.learningText}>
                Conhecimento, diversão e descobertas esperam por ele.
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
            style={styles.childModeButton}
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

          <View style={styles.statsRow}>
            <StatCard
              color="#E1F5FF"
              icon={require("../../assets/images/onboarding/guardian-home/time.png")}
              label="Tempo de uso"
              sublabel="de 2h por dia"
              value="1h 20min"
            />
            <StatCard
              color="#FFF1C7"
              icon={require("../../assets/images/onboarding/guardian-home/star.png")}
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

        <View style={styles.futureCard}>
          <Image
            resizeMode="contain"
            source={require("../../assets/images/onboarding/guardian-home/sprout.png")}
            style={styles.futureIcon}
          />
          <View>
            <Text style={styles.futureTitle}>
              Pequenas descobertas,{"\n"}grandes futuros!
            </Text>
            <Text style={styles.futureText}>Estamos juntos nessa jornada.</Text>
          </View>
        </View>

        <View style={styles.bottomNav}>
          <NavItem active icon="⌂" label="Início" />
          <NavItem
            iconSource={require("../../assets/images/onboarding/guardian-home/activities.png")}
            label="Atividades"
            onPress={onOpenActivities}
          />
          <NavItem
            iconSource={require("../../assets/images/onboarding/guardian-home/library.png")}
            label="Biblioteca"
          />
          <NavItem
            iconSource={require("../../assets/images/onboarding/guardian-home/reports.png")}
            label="Relatórios"
          />
          <NavItem
            iconSource={require("../../assets/images/onboarding/guardian-home/settings.png")}
            label="Mais"
          />
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
      <Image resizeMode="contain" source={icon} style={styles.statIcon} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.statValue}>{value}</Text>
      <Text numberOfLines={1} style={styles.statSub}>{sublabel}</Text>
    </View>
  );
}

function ShortcutCard({ color, icon, label, onPress }: Shortcut) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.shortcut, { backgroundColor: color }]}
    >
      <Image resizeMode="contain" source={icon} style={styles.shortcutIcon} />
      <Text numberOfLines={1} style={styles.shortcutLabel}>{label}</Text>
    </Pressable>
  );
}

function NavItem({
  active = false,
  icon,
  iconSource,
  label,
  onPress,
}: {
  active?: boolean;
  icon?: string;
  iconSource?: ImageSourcePropType;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.navItem}>
      {iconSource ? (
        <Image resizeMode="contain" source={iconSource} style={styles.navIconImage} />
      ) : (
        <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
      )}
      <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
    </Pressable>
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
    height: "25%",
    left: "-40%",
    bottom: "-14%",
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
  },
  hillFront: {
    position: "absolute",
    width: "140%",
    height: "24%",
    right: "-42%",
    bottom: "-15%",
    borderRadius: 999,
    backgroundColor: "#87CE72",
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  header: {
    width: "100%",
    maxWidth: 400,
    height: 285,
    alignItems: "center",
    position: "relative",
  },
  roundButton: {
    position: "absolute",
    top: 4,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  menuButton: { left: 0 },
  notificationButton: { right: 0 },
  menuIcon: { color: "#123C84", fontSize: 25, fontWeight: "800" },
  notificationIcon: { width: 42, height: 42, borderRadius: 21 },
  logo: { width: 185, height: 86 },
  greetingCopy: {
    position: "absolute",
    left: 8,
    top: 135,
    width: 205,
    zIndex: 2,
  },
  greeting: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: "900",
  },
  greetingSub: {
    color: "#405473",
    fontSize: 15,
    lineHeight: 20,
    marginTop: 6,
  },
  lumi: { position: "absolute", right: -8, bottom: -16 },
  dashboardCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 30,
    padding: 14,
    backgroundColor: colors.white,
    ...shadow,
  },
  learningCard: {
    minHeight: 112,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#EAF9E5",
  },
  learningIcon: { width: 90, height: 85 },
  learningCopy: { flex: 1, paddingHorizontal: 4 },
  learningTitle: {
    color: colors.deepGreen,
    fontFamily: roundedFont,
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "900",
  },
  learningText: { color: "#355E4B", fontSize: 12, lineHeight: 15, marginTop: 4 },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  arrow: { color: colors.green, fontSize: 29, lineHeight: 31 },
  childModeButton: {
    minHeight: 76,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 14,
    backgroundColor: "#63C76A",
    ...shadow,
  },
  childModeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1A8",
  },
  childModeIcon: { color: "#F2A81D", fontSize: 28, lineHeight: 31 },
  childModeCopy: { flex: 1, paddingHorizontal: 12 },
  childModeTitle: {
    color: colors.white,
    fontFamily: roundedFont,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "900",
  },
  childModeText: { color: "#F2FFF3", fontSize: 12, lineHeight: 17 },
  childModeArrow: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "600",
  },
  statsRow: { flexDirection: "row", gap: 7, marginTop: 10 },
  statCard: {
    flex: 1,
    minWidth: 0,
    height: 132,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  statIcon: { width: 44, height: 42 },
  statLabel: {
    minHeight: 30,
    color: "#123C84",
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  statValue: {
    maxWidth: "100%",
    minHeight: 34,
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 15,
    lineHeight: 17,
    fontWeight: "900",
    textAlign: "center",
  },
  statSub: { color: "#405473", fontSize: 10, marginTop: 1 },
  sectionTitle: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 13,
    marginBottom: 9,
  },
  shortcuts: { flexDirection: "row", gap: 7 },
  shortcut: {
    flex: 1,
    minWidth: 0,
    height: 86,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutIcon: { width: 46, height: 42 },
  shortcutLabel: {
    maxWidth: "100%",
    color: "#123C84",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
  },
  futureCard: {
    width: "100%",
    maxWidth: 400,
    minHeight: 100,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.88)",
    ...shadow,
  },
  futureIcon: { width: 76, height: 72 },
  futureTitle: {
    color: colors.deepGreen,
    fontFamily: roundedFont,
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "900",
  },
  futureText: { color: "#4F7561", fontSize: 12, marginTop: 4 },
  bottomNav: {
    width: "100%",
    maxWidth: 400,
    minHeight: 76,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 7,
    backgroundColor: colors.white,
    ...shadow,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navIcon: { color: "#75818E", fontSize: 25, height: 29 },
  navIconImage: { width: 28, height: 26, opacity: 0.72 },
  navLabel: { color: "#75818E", fontSize: 9, marginTop: 2 },
  navActive: { color: colors.green, fontWeight: "900" },
});