import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LumiSpeechBubble } from "../components/LumiSpeechBubble";
import { PrimaryButton } from "../components/PrimaryButton";
import { ChildProfile, RewardDefinition, WorldDefinition } from "../types";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  profile: ChildProfile;
  worlds: readonly WorldDefinition[];
  unlockedWorldIds: readonly string[];
  completedActivityIds: readonly string[];
  rewards: Readonly<Record<string, RewardDefinition>>;
  onOpenWorld: (worldId: string) => void;
  onEditProfile: () => void;
};

export function MapScreen({
  profile,
  worlds,
  unlockedWorldIds,
  completedActivityIds,
  rewards,
  onOpenWorld,
  onEditProfile,
}: Props) {
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
             {worlds[0]?.assets.mapPrompt}
          </LumiSpeechBubble>
           {worlds.map((world, index) => {
             const unlocked = unlockedWorldIds.includes(world.id);
             const reward = rewards[world.rewardId];
             const completedCount = world.activityIds.filter((id) =>
               completedActivityIds.includes(id),
             ).length;
             const complete = completedCount === world.activityIds.length;
             return (
               <View key={world.id}>
                 <View style={[styles.mapCard, !unlocked && styles.lockedCard]}>
                   <View style={styles.homeIcon}>
                     <Text style={styles.homeEmoji}>{world.assets.mapIcon}</Text>
                   </View>
                   <View style={styles.homeCopy}>
                     <Text style={styles.homeEyebrow}>MUNDO {index + 1}</Text>
                     <Text style={styles.homeTitle}>{world.title}</Text>
                     <Text style={styles.homeSub}>
                       {unlocked
                         ? `${completedCount}/${world.activityIds.length} descobertas`
                         : "Uma nova descoberta está a caminho"}
                     </Text>
                   </View>
                   <Text style={styles.homeArrow}>{unlocked ? "›" : "☁️"}</Text>
                 </View>
                 {unlocked ? (
                   <PrimaryButton
                     label={world.assets.entryLabel}
                     onPress={() => onOpenWorld(world.id)}
                     variant="blue"
                     style={styles.fullButton}
                   />
                 ) : null}
                 <View style={styles.progressCard}>
                   <View style={styles.progressCopy}>
                     <Text style={styles.progressTitle}>{world.title}</Text>
                     <Text style={styles.progressSub}>
                       {complete
                         ? "Descoberta completa!"
                         : unlocked
                           ? "Cada descoberta faz uma conquista crescer."
                           : "Complete o mundo anterior para explorar."}
                     </Text>
                   </View>
                   <Text style={styles.progressFlower}>
                     {complete && reward ? reward.icon : reward?.progressLockedIcon ?? "🌱"}
                   </Text>
                 </View>
               </View>
             );
           })}
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
  lockedCard: {
    opacity: 0.82,
    backgroundColor: "#F7F5EC",
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
  fullButton: {
    width: "100%",
    marginTop: 20,
  },
});