import React from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { BackButton } from "../components/BackButton";
import { LumiSpeechBubble } from "../components/LumiSpeechBubble";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { colors, shadow } from "../theme/colors";
import { ActivityDefinition, WorldDefinition } from "../types";
import { Shell } from "./components/Shell";

type Props = {
  completedActivityIds: string[];
  world: WorldDefinition;
  worldNumber: number;
  activities: ActivityDefinition[];
  onBack: () => void;
  onStart: () => void;
};

export function HouseScreen({
  completedActivityIds,
  world,
  worldNumber,
  activities,
  onBack,
  onStart,
}: Props) {
  const completedCount = activities.filter((activity) =>
    completedActivityIds.includes(activity.id),
  ).length;
  const nextLabel =
    completedCount === activities.length
      ? "Revisitar atividades"
      : "Começar a brincar";

  if (world.id === "fazenda-das-descobertas") {
    return (
      <FarmWorldEntrance
        activities={activities}
        completedActivityIds={completedActivityIds}
        completedCount={completedCount}
        nextLabel={nextLabel}
        onBack={onBack}
        onStart={onStart}
      />
    );
  }

  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inner}>
          <BackButton onPress={onBack} />
          <View style={styles.houseHeader}>
            <Text style={styles.houseEmoji}>{world.assets.mapIcon}</Text>
            <View>
              <Text style={styles.pageKicker}>MUNDO {worldNumber}</Text>
              <Text style={styles.pageTitle}>{world.title}</Text>
            </View>
          </View>
          <LumiSpeechBubble expression="curious">
            {world.assets.introPrompt ??
              `${world.description} Vamos descobrir juntos.`}
          </LumiSpeechBubble>
          <View style={styles.activityList}>
            {activities.map((activity, index) => {
              const done = completedActivityIds.includes(activity.id);
              return (
                <View key={activity.id} style={styles.activityRow}>
                  <View style={[styles.activityNumber, done && styles.activityDone]}>
                    <Text style={styles.activityNumberText}>
                      {done ? "✓" : index + 1}
                    </Text>
                  </View>
                  <View style={styles.activityCopy}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activitySubtitle}>{activity.hint}</Text>
                  </View>
                  <Text style={styles.activityEmoji}>
                    {activity.previewEmoji}
                  </Text>
                </View>
              );
            })}
          </View>
          <ProgressIndicator current={completedCount} total={activities.length} />
          <PrimaryButton
            label={nextLabel}
            onPress={onStart}
            variant="green"
            style={styles.fullButton}
          />
        </View>
      </ScrollView>
    </Shell>
  );
}

function FarmWorldEntrance({
  activities,
  completedActivityIds,
  completedCount,
  nextLabel,
  onBack,
  onStart,
}: {
  activities: ActivityDefinition[];
  completedActivityIds: string[];
  completedCount: number;
  nextLabel: string;
  onBack: () => void;
  onStart: () => void;
}) {
  const { height } = useWindowDimensions();
  const nextActivityIndex = activities.findIndex(
    (activity) => !completedActivityIds.includes(activity.id),
  );

  return (
    <Shell>
      <View style={[styles.farmScreen, { minHeight: height }]}>
        <ImageBackground
          accessibilityLabel="Mundo da Fazenda"
          imageStyle={styles.farmBackgroundImage}
          resizeMode="cover"
          source={require("../../attached_assets/farm-discoveries-no-mock-status.png")}
          style={[styles.farmBackground, { height }]}
        >
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            onPress={onBack}
            style={styles.farmBackHotspot}
          />
          <View style={styles.farmActivityPanel}>
            <View style={styles.farmProgressHeader}>
              <Text style={styles.farmProgressStar}>⭐</Text>
              <View style={styles.farmProgressCopy}>
                <Text style={styles.farmProgressText}>
                  {Math.min(completedCount + 1, activities.length)} de{" "}
                  {activities.length} atividades
                </Text>
                <View style={styles.farmProgressTrack}>
                  <View
                    style={[
                      styles.farmProgressFill,
                      {
                        width: `${Math.max(
                          12,
                          (completedCount / activities.length) * 100,
                        )}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.farmProgressHint}>
                🌱 Muitas descobertas{"\n"}te esperam!
              </Text>
            </View>
            <View style={styles.farmRows}>
              {activities.map((activity, index) => {
                const done = completedActivityIds.includes(activity.id);
                const available =
                  done ||
                  index === nextActivityIndex ||
                  nextActivityIndex === -1;
                return (
                  <View
                    accessibilityLabel={`${activity.title}, ${
                      done
                        ? "concluída"
                        : available
                          ? "desbloqueada"
                          : "bloqueada"
                    }`}
                    key={activity.id}
                    style={[
                      styles.farmActivityRow,
                      available && styles.farmActivityRowAvailable,
                    ]}
                  >
                    <View
                      style={[
                        styles.farmActivityNumber,
                        available && styles.farmActivityNumberAvailable,
                      ]}
                    >
                      <Text style={styles.farmActivityNumberText}>
                        {done ? "✓" : index + 1}
                      </Text>
                    </View>
                    <Text style={styles.farmActivityEmoji}>
                      {activity.previewEmoji}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.farmActivityTitle,
                        !available && styles.farmActivityTitleLocked,
                      ]}
                    >
                      {activity.title}
                    </Text>
                    <Text style={styles.farmActivityStatus}>
                      {done ? "✓" : available ? "➜" : "🔒"}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <Pressable
            accessibilityHint="Abre a próxima atividade da Fazenda"
            accessibilityLabel={nextLabel}
            accessibilityRole="button"
            onPress={onStart}
            style={styles.farmStartHotspot}
          />
        </ImageBackground>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  farmScreen: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#BCEFFF",
  },
  farmBackground: {
    width: "100%",
  },
  farmBackgroundImage: {
    transform: [{ scale: 1.045 }],
  },
  farmBackHotspot: {
    position: "absolute",
    top: "7%",
    left: "4%",
    width: "17%",
    height: "9%",
    borderRadius: 40,
  },
  farmStartHotspot: {
    position: "absolute",
    left: "12%",
    bottom: "10%",
    width: "76%",
    height: "10%",
    borderRadius: 40,
  },
  farmActivityPanel: {
    position: "absolute",
    top: "33.5%",
    left: "7%",
    right: "7%",
    height: "51.5%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 26,
    backgroundColor: "rgba(255, 252, 243, 0.98)",
  },
  farmProgressHeader: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  farmProgressStar: {
    fontSize: 21,
  },
  farmProgressCopy: {
    flex: 1,
  },
  farmProgressText: {
    color: "#174A75",
    fontSize: 14,
    fontWeight: "900",
  },
  farmProgressTrack: {
    height: 5,
    marginTop: 4,
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: "#DCE8EE",
  },
  farmProgressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#45B84A",
  },
  farmProgressHint: {
    color: "#174A75",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  farmRows: {
    flex: 1,
    gap: 4,
  },
  farmActivityRow: {
    flex: 1,
    minHeight: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: "#EAF1F5",
  },
  farmActivityRowAvailable: {
    backgroundColor: "#E8F8E3",
    borderWidth: 1.5,
    borderColor: "#70CD60",
  },
  farmActivityNumber: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#8EA2B3",
  },
  farmActivityNumberAvailable: {
    backgroundColor: "#35A943",
  },
  farmActivityNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  farmActivityEmoji: {
    width: 39,
    marginLeft: 6,
    fontSize: 25,
    textAlign: "center",
  },
  farmActivityTitle: {
    flex: 1,
    marginLeft: 7,
    color: "#175B31",
    fontSize: 13,
    fontWeight: "900",
  },
  farmActivityTitleLocked: {
    color: "#174A75",
  },
  farmActivityStatus: {
    width: 28,
    fontSize: 19,
    textAlign: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingVertical: 22,
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
  fullButton: {
    width: "100%",
    marginTop: 20,
  },
});