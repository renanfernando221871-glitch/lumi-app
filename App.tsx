import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BackButton } from "./src/components/BackButton";
import { LumiSpeechBubble } from "./src/components/LumiSpeechBubble";
import { PrimaryButton } from "./src/components/PrimaryButton";
import { RewardModal } from "./src/components/RewardModal";
import { ProgressIndicator } from "./src/components/ProgressIndicator";
import { activities } from "./src/data/activities";
import { ActivityScreen } from "./src/screens/ActivityScreen";
import { colors, shadow } from "./src/theme/colors";
import { ChildProfile, ProgressState, ScreenName } from "./src/types";
import {
  defaultProfile,
  defaultProgress,
  loadSavedState,
  saveProfile,
  saveProgress,
} from "./src/storage/progress";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("splash");
  const [profile, setProfile] = useState<ChildProfile>(defaultProfile);
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [activityIndex, setActivityIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadSavedState().then(({ profile: savedProfile, progress: savedProgress }) => {
      if (!mounted) return;
      setProfile(savedProfile);
      setProgress(savedProgress);
      setHydrated(true);
      setTimeout(() => {
        if (mounted) setScreen(savedProfile.hasOnboarded ? "map" : "welcome");
      }, 850);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const currentActivity = activities[activityIndex];
  const completedCount = progress.completedActivityIds.length;

  const updateProfile = (name: string, avatar: string) => {
    const next = { name, avatar, hasOnboarded: true };
    setProfile(next);
    saveProfile(next).catch(() => undefined);
    setScreen("map");
  };

  const completeActivity = () => {
    const completed = progress.completedActivityIds.includes(currentActivity.id)
      ? progress.completedActivityIds
      : [...progress.completedActivityIds, currentActivity.id];
    const nextProgress = {
      completedActivityIds: completed,
      earnedReward: completed.length === activities.length || progress.earnedReward,
    };
    setProgress(nextProgress);
    saveProgress(nextProgress).catch(() => undefined);

    if (activityIndex === activities.length - 1) {
      setShowReward(true);
    } else {
      setActivityIndex((value) => value + 1);
    }
  };

  const startActivities = () => {
    const firstIncomplete = activities.findIndex(
      (activity) => !progress.completedActivityIds.includes(activity.id),
    );
    setActivityIndex(firstIncomplete === -1 ? 0 : firstIncomplete);
    setScreen("activity");
  };

  if (!hydrated || screen === "splash") {
    return (
      <Shell>
        <View style={styles.splash}>
          <View style={styles.sunBadge}>
            <Text style={styles.sun}>🌻</Text>
          </View>
          <Text style={styles.brand}>lumi</Text>
          <Text style={styles.splashTagline}>crescer é descobrir</Text>
          <View style={styles.loadingDots}>
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, styles.loadingDotActive]} />
            <View style={styles.loadingDot} />
          </View>
        </View>
      </Shell>
    );
  }

  if (screen === "welcome") {
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
              onPress={() => setScreen("personalize")}
              variant="green"
              style={styles.fullButton}
            />
          </View>
        </ScrollView>
      </Shell>
    );
  }

  if (screen === "personalize") {
    return (
      <PersonalizeScreen
        initialName={profile.name}
        onBack={() => setScreen("welcome")}
        onContinue={updateProfile}
      />
    );
  }

  if (screen === "map") {
    return (
      <MapScreen
        profile={profile}
        completedCount={completedCount}
        onOpenHouse={startActivities}
        onEditProfile={() => setScreen("personalize")}
      />
    );
  }

  if (screen === "house") {
    return (
      <HouseScreen
        completedCount={completedCount}
        onBack={() => setScreen("map")}
        onStart={startActivities}
      />
    );
  }

  return (
    <>
      <ActivityScreen
        activity={currentActivity}
        activityNumber={activityIndex + 1}
        total={activities.length}
        onBack={() => setScreen("house")}
        onComplete={completeActivity}
      />
      <RewardModal
        visible={showReward}
        onClose={() => {
          setShowReward(false);
          setScreen("map");
        }}
      />
    </>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {children}
    </SafeAreaView>
  );
}

function PersonalizeScreen({
  initialName,
  onBack,
  onContinue,
}: {
  initialName: string;
  onBack: () => void;
  onContinue: (name: string, avatar: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState("🌻");
  const avatars = ["🌻", "🦋", "🐰", "🦊"];

  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inner}>
          <BackButton onPress={onBack} />
          <Text style={styles.pageKicker}>UM POUQUINHO SOBRE VOCÊ</Text>
          <Text style={styles.pageTitle}>Como posso te chamar?</Text>
          <LumiSpeechBubble compact>Escolha um nome e uma carinha!</LumiSpeechBubble>
          <Text style={styles.inputLabel}>SEU NOME</Text>
          <Text
            accessibilityRole="text"
            style={styles.fakeInput}
            onPress={() => setName(name ? "" : "Amigo")}
          >
            {name || "Toque para escrever seu nome"}
          </Text>
          <Text style={styles.inputHint}>No preview, toque no nome para usar “Amigo”.</Text>
          <Text style={styles.inputLabel}>SUA COMPANHEIRA</Text>
          <View style={styles.avatarRow}>
            {avatars.map((item) => (
              <Text
                key={item}
                onPress={() => setAvatar(item)}
                style={[styles.avatar, avatar === item && styles.selectedAvatar]}
              >
                {item}
              </Text>
            ))}
          </View>
          <PrimaryButton
            label="Entrar no meu jardim"
            onPress={() => onContinue(name.trim() || "Amigo", avatar)}
            variant="green"
            style={styles.fullButton}
          />
        </View>
      </ScrollView>
    </Shell>
  );
}

function MapScreen({
  profile,
  completedCount,
  onOpenHouse,
  onEditProfile,
}: {
  profile: ChildProfile;
  completedCount: number;
  onOpenHouse: () => void;
  onEditProfile: () => void;
}) {
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.mapInner}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.greeting}>Oi, {profile.name}!</Text>
              <Text style={styles.mapTitle}>Seu jardim de descobertas</Text>
            </View>
            <Text onPress={onEditProfile} style={styles.profileAvatar}>
              {profile.avatar}
            </Text>
          </View>
          <View style={styles.mapIllustration}>
            <Text style={styles.mapSun}>☀️</Text>
            <Text style={styles.mapCloud}>☁️</Text>
            <Text style={styles.mapTree}>🌳</Text>
            <Text style={styles.mapFlower}>🌷 🌼 🌷</Text>
            <Text style={styles.mapPath}>⌁  ·  ⌁  ·  ⌁</Text>
          </View>
          <LumiSpeechBubble>
            A Casa do Lumi está pertinho. Vamos olhar lá dentro?
          </LumiSpeechBubble>
          <View style={styles.mapCard}>
            <View style={styles.homeIcon}>
              <Text style={styles.homeEmoji}>🏡</Text>
            </View>
            <View style={styles.homeCopy}>
              <Text style={styles.homeEyebrow}>MUNDO 1</Text>
              <Text style={styles.homeTitle}>Casa do Lumi</Text>
              <Text style={styles.homeSub}>3 descobertas para fazer</Text>
            </View>
            <Text style={styles.homeArrow}>›</Text>
          </View>
          <PrimaryButton label="Entrar na casa" onPress={onOpenHouse} variant="blue" style={styles.fullButton} />
          <View style={styles.progressCard}>
            <View style={styles.progressCopy}>
              <Text style={styles.progressTitle}>Seu jardim</Text>
              <Text style={styles.progressSub}>
                {completedCount === 3 ? "Uma flor nasceu!" : "Cada descoberta faz uma flor crescer."}
              </Text>
            </View>
            <Text style={styles.progressFlower}>{completedCount === 3 ? "🌼" : "🌱"}</Text>
          </View>
        </View>
      </ScrollView>
    </Shell>
  );
}

function HouseScreen({
  completedCount,
  onBack,
  onStart,
}: {
  completedCount: number;
  onBack: () => void;
  onStart: () => void;
}) {
  const nextLabel = completedCount === 3 ? "Revisitar atividades" : "Começar a brincar";
  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inner}>
          <BackButton onPress={onBack} />
          <View style={styles.houseHeader}>
            <Text style={styles.houseEmoji}>🏡</Text>
            <View>
              <Text style={styles.pageKicker}>MUNDO 1</Text>
              <Text style={styles.pageTitle}>Casa do Lumi</Text>
            </View>
          </View>
          <LumiSpeechBubble>
            Vamos cuidar da casa juntos? Cada brincadeira esconde uma descoberta.
          </LumiSpeechBubble>
          <View style={styles.activityList}>
            {activities.map((activity, index) => {
              const done = index < completedCount;
              return (
                <View key={activity.id} style={styles.activityRow}>
                  <View style={[styles.activityNumber, done && styles.activityDone]}>
                    <Text style={styles.activityNumberText}>{done ? "✓" : index + 1}</Text>
                  </View>
                  <View style={styles.activityCopy}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activitySubtitle}>{activity.helper}</Text>
                  </View>
                  <Text style={styles.activityEmoji}>
                    {activity.items.find((item) => item.isTarget)?.emoji}
                  </Text>
                </View>
              );
            })}
          </View>
          <ProgressIndicator current={completedCount} total={activities.length} />
          <PrimaryButton label={nextLabel} onPress={onStart} variant="green" style={styles.fullButton} />
        </View>
      </ScrollView>
    </Shell>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flexGrow: 1,
    paddingVertical: 22,
  },
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
  },
  sunBadge: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
    ...shadow,
  },
  sun: {
    fontSize: 62,
  },
  brand: {
    color: colors.deepGreen,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
    marginTop: 18,
  },
  splashTagline: {
    color: colors.green,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 7,
    marginTop: 36,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  loadingDotActive: {
    backgroundColor: colors.green,
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
  inner: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingBottom: 25,
  },
  pageKicker: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginTop: 11,
  },
  pageTitle: {
    color: colors.deepGreen,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 18,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: "900",
    marginTop: 27,
    marginBottom: 8,
  },
  fakeInput: {
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 17,
    color: colors.deepGreen,
    fontSize: 16,
    fontWeight: "700",
    backgroundColor: colors.white,
  },
  inputHint: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 7,
  },
  avatarRow: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 34,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.line,
  },
  selectedAvatar: {
    borderColor: colors.green,
    backgroundColor: colors.softGreen,
    borderWidth: 4,
  },
  mapInner: {
    width: "100%",
    maxWidth: 740,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  greeting: {
    color: colors.green,
    fontSize: 15,
    fontWeight: "800",
  },
  mapTitle: {
    color: colors.deepGreen,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 28,
    backgroundColor: colors.softYellow,
  },
  mapIllustration: {
    height: 230,
    borderRadius: 28,
    position: "relative",
    overflow: "hidden",
    marginBottom: 17,
    backgroundColor: "#BFE6FA",
    ...shadow,
  },
  mapSun: {
    position: "absolute",
    top: 19,
    right: 30,
    fontSize: 43,
  },
  mapCloud: {
    position: "absolute",
    top: 32,
    left: 35,
    fontSize: 33,
  },
  mapTree: {
    position: "absolute",
    bottom: 38,
    left: 30,
    fontSize: 72,
  },
  mapFlower: {
    position: "absolute",
    bottom: 30,
    right: 20,
    fontSize: 29,
  },
  mapPath: {
    position: "absolute",
    bottom: 62,
    left: "37%",
    color: colors.yellow,
    fontSize: 29,
    fontWeight: "900",
  },
  mapCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 19,
    borderRadius: 23,
    backgroundColor: colors.white,
    ...shadow,
  },
  homeIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.softYellow,
  },
  homeEmoji: {
    fontSize: 39,
  },
  homeCopy: {
    flex: 1,
    marginLeft: 14,
  },
  homeEyebrow: {
    color: colors.coral,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  homeTitle: {
    color: colors.deepGreen,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 2,
  },
  homeSub: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  homeArrow: {
    color: colors.green,
    fontSize: 35,
    paddingHorizontal: 6,
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 14,
    borderRadius: 23,
    backgroundColor: colors.softGreen,
  },
  progressCopy: {
    flex: 1,
  },
  progressTitle: {
    color: colors.deepGreen,
    fontSize: 16,
    fontWeight: "900",
  },
  progressSub: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  progressFlower: {
    fontSize: 39,
    marginLeft: 10,
  },
  houseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 18,
  },
  houseEmoji: {
    width: 66,
    height: 66,
    borderRadius: 20,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 39,
    backgroundColor: colors.softYellow,
  },
  activityList: {
    marginTop: 24,
    gap: 10,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 77,
    padding: 11,
    borderRadius: 20,
    backgroundColor: colors.white,
    ...shadow,
  },
  activityNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.softBlue,
  },
  activityDone: {
    backgroundColor: colors.green,
  },
  activityNumberText: {
    color: colors.deepGreen,
    fontSize: 16,
    fontWeight: "900",
  },
  activityCopy: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    color: colors.deepGreen,
    fontSize: 15,
    fontWeight: "900",
  },
  activitySubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  activityEmoji: {
    fontSize: 31,
    marginHorizontal: 8,
  },
});