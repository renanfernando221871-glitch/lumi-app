import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { LeluaLogo } from "../components/LeluaLogo";

type Props = {
  onBack: () => void;
  onOpenSettings: () => void;
};

const activities = [
  { title: "Quem faz muuu?", icon: require("../../assets/images/farm-activities/cow.png"), state: "done" },
  { title: "Encontre o cavalo", icon: require("../../assets/images/farm-activities/horse.png"), state: "done" },
  { title: "O animal marrom", icon: require("../../assets/images/farm-activities/brown-animal.png"), state: "done" },
  { title: "Conte os pintinhos", icon: require("../../assets/images/farm-activities/chicks.png"), state: "done" },
  { title: "Do maior para o menor", icon: require("../../assets/images/farm-activities/size-order.png"), state: "active" },
  { title: "De onde vem?", icon: require("../../assets/images/farm-activities/product-origin.png"), state: "locked" },
  { title: "Na frente ou atrás?", icon: require("../../assets/images/farm-activities/spatial-position.png"), state: "locked" },
  { title: "Ajude na colheita", icon: require("../../assets/images/farm-activities/harvest.png"), state: "locked" },
] as const;

export function FarmDiscoveriesScreen({
  onBack,
  onOpenSettings,
}: Props) {
  const { width } = useWindowDimensions();
  const compact = width <= 370;
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(false), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const pressActivity = () => setNotice(true);

  return (
    <View style={styles.screen}>
      <Image
        accessibilityLabel="Cenário ilustrado da Fazenda"
        source={require("../../assets/images/farm/farm-scenery-clean.png")}
        resizeMode="cover"
        style={styles.scenery}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Voltar ao mapa"
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <LeluaLogo compact style={styles.logo} />
          <Pressable
            accessibilityLabel="Abrir configurações"
            accessibilityRole="button"
            onPress={onOpenSettings}
            style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}
          >
            <Image
              source={require("../../assets/images/onboarding/guardian-home/settings-framed.png")}
              resizeMode="contain"
              style={styles.settings}
            />
          </Pressable>
        </View>

        <View style={[styles.hero, compact && styles.heroCompact]}>
          <View style={styles.woodSign}>
            <Text style={styles.signSmall}>Descobertas da</Text>
            <Text style={styles.signLarge}>Fazenda</Text>
          </View>
          <Image
            accessibilityLabel="Leluá, pronta para descobrir a fazenda"
            source={require("../../assets/images/lumi/lumi-main.png")}
            resizeMode="contain"
            style={styles.lumi}
          />
        </View>

        <Text style={[styles.instruction, compact && styles.instructionCompact]}>
          Escolha uma atividade para começar a explorar!
        </Text>

        <View style={[styles.card, compact && styles.cardCompact]}>
          <View style={styles.cardHeader}>
            <View style={styles.progressBlock}>
              <View style={styles.progressLabel}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.progressText}>4 de 8 atividades</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>
            <Text style={styles.waiting}>Muitas descobertas{"\n"}te esperam!</Text>
          </View>

          <View style={styles.activityList}>
            {activities.map((activity, index) => (
              <Pressable
                key={activity.title}
                  accessibilityLabel={`${activity.title}, ${
                    activity.state === "locked"
                      ? "bloqueada"
                      : activity.state === "active"
                        ? "disponível"
                        : "concluída"
                  }`}
                accessibilityRole="button"
                onPress={pressActivity}
                style={({ pressed }) => [
                  styles.activityRow,
                  activity.state === "locked"
                    ? styles.lockedRow
                    : activity.state === "active"
                      ? styles.activeRow
                      : styles.doneRow,
                  pressed && styles.rowPressed,
                ]}
              >
                <View
                  style={[
                    styles.stateCircle,
                    activity.state === "locked" ? styles.lockedCircle : styles.doneCircle,
                  ]}
                >
                  <Text style={activity.state === "locked" || activity.state === "active" ? styles.number : styles.check}>
                    {activity.state === "locked"
                      ? index + 1
                      : activity.state === "active"
                        ? 5
                        : "✓"}
                  </Text>
                </View>
                <View style={styles.activityIcon}>
                  <Image source={activity.icon} resizeMode="contain" style={styles.activityImage} />
                </View>
                <Text style={[styles.activityTitle, activity.state === "locked" && styles.lockedTitle]}>
                  {activity.title}
                </Text>
                {activity.state === "locked" ? (
                  <View style={styles.lockIcon} accessibilityLabel="Bloqueada">
                    <View style={styles.lockShackle} />
                    <View style={styles.lockBody} />
                  </View>
                ) : (
                  <Text style={activity.state === "active" ? styles.next : styles.rowCheck}>
                    {activity.state === "active" ? "→" : "✓"}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {notice ? <Text style={styles.notice}>Esta atividade será adicionada na próxima etapa.</Text> : null}

        <Pressable
          accessibilityLabel="Refazer atividade"
          accessibilityRole="button"
          onPress={pressActivity}
          style={({ pressed }) => [styles.retry, pressed && styles.retryPressed]}
        >
          <Text style={styles.retryText}>Refazer atividade →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: "100%", overflow: "hidden", backgroundColor: "#8BD7EC" },
  scenery: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  content: { flex: 1, alignItems: "center", paddingTop: 10, paddingHorizontal: 18, paddingBottom: 9 },
  header: { width: "100%", height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roundButton: { width: 47, height: 47, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFDF8", shadowColor: "#2B6A71", shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  backArrow: { color: "#164F7D", fontSize: 43, lineHeight: 43, fontFamily: "Nunito_700Bold", marginTop: -5 },
  settings: { width: 33, height: 33 },
  logo: { width: 156, height: 69 },
  hero: { width: "100%", height: 173, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  heroCompact: { height: 151 },
  woodSign: { width: "55%", maxWidth: 220, paddingVertical: 13, paddingHorizontal: 6, borderRadius: 11, alignItems: "center", backgroundColor: "#A96538", borderWidth: 4, borderColor: "#814A2E", transform: [{ rotate: "-2deg" }], shadowColor: "#356B4A", shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  signSmall: { color: "#FFF3D1", fontFamily: "Fredoka_700Bold", fontSize: 17, lineHeight: 21 },
  signLarge: { color: "#FFF8DE", fontFamily: "Fredoka_700Bold", fontSize: 30, lineHeight: 34, textShadowColor: "rgba(77,39,24,.25)", textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2 },
  lumi: { width: "43%", height: 173, alignSelf: "flex-end", marginLeft: -3 },
  instruction: { color: "#124E7A", fontFamily: "Fredoka_700Bold", fontSize: 16, lineHeight: 20, textAlign: "center", marginBottom: 8 },
  instructionCompact: { fontSize: 14, lineHeight: 18, marginBottom: 5 },
  card: { width: "100%", maxWidth: 465, flex: 1, minHeight: 0, paddingHorizontal: 13, paddingTop: 14, paddingBottom: 11, borderRadius: 24, backgroundColor: "#FFFDF7", shadowColor: "#276E69", shadowOpacity: 0.18, shadowRadius: 11, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  cardCompact: { paddingTop: 10, paddingHorizontal: 10, borderRadius: 21 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 3, marginBottom: 9 },
  progressBlock: { width: "62%" },
  progressLabel: { flexDirection: "row", alignItems: "center" },
  star: { color: "#FFC62E", fontSize: 34, lineHeight: 34, marginRight: 9 },
  progressText: { color: "#124E7A", fontFamily: "Fredoka_700Bold", fontSize: 19 },
  progressTrack: { height: 8, marginLeft: 38, marginTop: 4, borderRadius: 5, backgroundColor: "#DCEAF0", overflow: "hidden" },
  progressFill: { width: "50%", height: "100%", borderRadius: 5, backgroundColor: "#27B969" },
  waiting: { color: "#124E7A", fontFamily: "Nunito_700Bold", fontSize: 13, lineHeight: 16, textAlign: "center" },
  activityList: { flex: 1, justifyContent: "space-between" },
  activityRow: { minHeight: 41, flex: 1, maxHeight: 53, marginVertical: 2, borderRadius: 16, paddingHorizontal: 9, flexDirection: "row", alignItems: "center" },
  doneRow: { backgroundColor: "#E2F5D9" },
  activeRow: { backgroundColor: "#D2F3D7" },
  lockedRow: { backgroundColor: "#EAF2F5" },
  rowPressed: { opacity: 0.66, transform: [{ scale: 0.985 }] },
  stateCircle: { width: 35, height: 35, borderRadius: 18, alignItems: "center", justifyContent: "center", marginRight: 8 },
  doneCircle: { backgroundColor: "#35B969" },
  lockedCircle: { backgroundColor: "#A8BFCC" },
  check: { color: "#FFFDF7", fontFamily: "Nunito_800ExtraBold", fontSize: 23, lineHeight: 25 },
  number: { color: "#FFFDF7", fontFamily: "Fredoka_700Bold", fontSize: 17 },
  activityIcon: { width: 39, alignItems: "center", justifyContent: "center" },
  activityImage: { width: 35, height: 35 },
  activityTitle: { flex: 1, color: "#0F6149", fontFamily: "Fredoka_700Bold", fontSize: 16, lineHeight: 20 },
  lockedTitle: { color: "#1E537D" },
  rowCheck: { color: "#27B969", fontFamily: "Nunito_800ExtraBold", fontSize: 27, lineHeight: 29, marginLeft: 4 },
  next: { color: "#21B66A", fontFamily: "Nunito_800ExtraBold", fontSize: 31, lineHeight: 32, marginLeft: 3 },
  lockIcon: { width: 22, height: 25, alignItems: "center", justifyContent: "flex-end", marginRight: 1 },
  lockShackle: { position: "absolute", top: 0, width: 14, height: 14, borderWidth: 3, borderBottomWidth: 0, borderColor: "#286087", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  lockBody: { width: 22, height: 15, borderRadius: 4, backgroundColor: "#286087" },
  notice: { position: "absolute", bottom: 66, left: 26, right: 26, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, color: "#FFFDF7", backgroundColor: "#245D69", fontFamily: "Nunito_700Bold", fontSize: 12, textAlign: "center", overflow: "hidden" },
  retry: { width: "100%", maxWidth: 465, height: 50, marginTop: 14, borderRadius: 25, alignItems: "center", justifyContent: "center", backgroundColor: "#2DC65B", shadowColor: "#246E48", shadowOpacity: 0.2, shadowRadius: 7, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  retryPressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  retryText: { color: "#FFFDF7", fontFamily: "Fredoka_700Bold", fontSize: 19 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.95 }] },
});