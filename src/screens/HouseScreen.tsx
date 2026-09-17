import React, { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BackButton } from "../components/BackButton";
import { LeluaLogo } from "../components/LeluaLogo";
import { LumiSpeechBubble } from "../components/LumiSpeechBubble";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { colors, shadow } from "../theme/colors";
import { ActivityDefinition, WorldDefinition } from "../types";
import { Shell } from "./components/Shell";

const farmActivityIcons: Readonly<Record<string, ImageSourcePropType>> = {
  "farm-who-moo": require("../../assets/images/farm-activities/cow.png"),
  "farm-find-horse": require("../../assets/images/farm-activities/horse.png"),
  "farm-brown-animal": require("../../assets/images/farm-activities/brown-animal.png"),
  "farm-count-chicks": require("../../assets/images/farm-activities/chicks.png"),
  "farm-order-size": require("../../assets/images/farm-activities/size-order.png"),
  "farm-who-gives-what": require("../../assets/images/farm-activities/product-origin.png"),
  "farm-front-or-back": require("../../assets/images/farm-activities/spatial-position.png"),
  "farm-help-harvest": require("../../assets/images/farm-activities/harvest.png"),
};

type Props = {
  completedActivityIds: string[];
  world: WorldDefinition;
  worldNumber: number;
  activities: ActivityDefinition[];
  onBack: () => void;
  onStart: (activityId?: string) => void;
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
            onPress={() => onStart()}
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
  onBack,
  onStart,
}: {
  activities: ActivityDefinition[];
  completedActivityIds: string[];
  completedCount: number;
  onBack: () => void;
  onStart: (activityId: string) => void;
}) {
  const nextActivityIndex = activities.findIndex(
    (activity) => !completedActivityIds.includes(activity.id),
  );
  const selectedIndex = nextActivityIndex < 0 ? 0 : nextActivityIndex;
  const defaultSelectedActivityId = activities[selectedIndex]?.id;
  const [selectedActivityId, setSelectedActivityId] = useState(
    defaultSelectedActivityId,
  );
  const selectedActivity = activities.find(
    (activity) => activity.id === selectedActivityId,
  );
  const selectedIsCompleted = selectedActivity
    ? completedActivityIds.includes(selectedActivity.id)
    : false;
  const selectedIsAvailable =
    !!selectedActivity &&
    (selectedIsCompleted ||
      selectedActivity.id === activities[nextActivityIndex]?.id);

  useEffect(() => {
    if (selectedIsAvailable) return;
    setSelectedActivityId(defaultSelectedActivityId);
  }, [defaultSelectedActivityId, selectedIsAvailable]);

  return (
    <Shell>
      <View style={styles.farmScreen}>
        <Image
          accessibilityLabel="Paisagem da Fazenda"
          source={require("../../attached_assets/generated_images/farm-scenery-clean.png")}
          style={styles.farmScenery}
          resizeMode="cover"
        />
        <View style={styles.farmScroll}>
          <View style={styles.farmHeader}>
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [
                styles.farmHeaderButton,
                pressed && styles.farmHeaderButtonPressed,
              ]}
            >
              <Text style={styles.farmBackIcon}>‹</Text>
            </Pressable>
            <LeluaLogo compact accessibilityLabel="Leluá" style={styles.farmLogo} />
            <Pressable
              accessibilityLabel="Configurações"
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              disabled
              style={styles.farmHeaderButton}
            >
              <Image
                accessibilityLabel="Configurações"
                source={require("../../assets/images/onboarding/guardian-home/settings-framed.png")}
                style={styles.settingsIcon}
              />
            </Pressable>
          </View>

          <View style={styles.farmHero}>
            <View style={styles.farmSign}>
              <Text style={styles.farmSignSmall}>Descobertas da</Text>
              <Text style={styles.farmSignLarge}>Fazenda</Text>
            </View>
            <Image
              accessibilityLabel="Leluá curiosa e acolhedora"
              resizeMode="contain"
              source={require("../../attached_assets/generated_images/lelua-farm-cutout.png")}
              style={styles.farmLumi}
            />
          </View>
          <Text style={styles.farmInstruction}>
            Escolha uma atividade para começar a explorar!
          </Text>

          <View style={styles.farmActivityPanel}>
            <View style={styles.farmProgressHeader}>
              <Text style={styles.farmProgressStar}>★</Text>
              <View style={styles.farmProgressCopy}>
                <Text style={styles.farmProgressText}>
                  {completedCount} de {activities.length} atividades
                </Text>
                <View style={styles.farmProgressTrack}>
                  <View
                    style={[
                      styles.farmProgressFill,
                      { width: `${(completedCount / Math.max(activities.length, 1)) * 100}%` },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.farmProgressHint}>Muitas descobertas{"\n"}te esperam!</Text>
            </View>
            <ScrollView
              contentContainerStyle={styles.farmRows}
              horizontal={false}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              style={styles.farmRowsScroll}
            >
              {activities.map((activity, index) => {
                const done = completedActivityIds.includes(activity.id);
                const available = done || index === nextActivityIndex;
                const selected = activity.id === selectedActivityId;
                const displayTitle =
                  activity.id === "farm-who-moo" ? "Quem faz muuu?" : activity.title;
                return (
                  <Pressable
                    accessibilityLabel={`${displayTitle}, ${
                      done
                        ? "concluída"
                        : available
                          ? "disponível"
                          : "bloqueada; conclua a atividade anterior"
                    }`}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !available, selected }}
                    disabled={!available}
                    key={activity.id}
                    onPress={() => setSelectedActivityId(activity.id)}
                    style={({ pressed }) => [
                      styles.farmActivityRow,
                      done && styles.farmActivityRowDone,
                      selected && styles.farmActivityRowSelected,
                      !available && styles.farmActivityRowLocked,
                      pressed && styles.farmActivityRowPressed,
                    ]}
                  >
                    <View style={[styles.farmActivityNumber, done && styles.farmActivityNumberDone, selected && styles.farmActivityNumberSelected, !available && styles.farmActivityNumberLocked]}>
                      <Text style={styles.farmActivityNumberText}>{done ? "✓" : index + 1}</Text>
                    </View>
                    <View style={styles.farmActivityIconFrame}>
                      <Image
                        accessibilityIgnoresInvertColors
                        accessibilityLabel={`Ilustração: ${displayTitle}`}
                        resizeMode="contain"
                        source={
                          farmActivityIcons[activity.id] ??
                          farmActivityIcons["farm-help-harvest"]
                        }
                        style={styles.farmActivityIcon}
                      />
                    </View>
                    <Text style={[styles.farmActivityTitle, !available && styles.farmActivityTitleLocked]}>
                      {displayTitle}
                    </Text>
                    {done ? (
                      <Text style={styles.farmActivityStatus}>✓</Text>
                    ) : available ? (
                      <Text style={styles.farmActivityStatus}>→</Text>
                    ) : (
                      <View style={styles.lockIcon} accessibilityLabel="Bloqueada">
                        <View style={styles.lockShackle} />
                        <View style={styles.lockBody} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.farmButtonArea}>
            <PrimaryButton
              label={selectedIsCompleted ? "Refazer atividade" : "Começar atividade"}
              onPress={() => {
                if (selectedActivity) onStart(selectedActivity.id);
              }}
              variant="green"
              disabled={!selectedActivity || !selectedIsAvailable}
              style={styles.farmStartButton}
              textStyle={styles.farmButtonText}
            />
          </View>
        </View>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  farmScreen: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#C9EEF4",
  },
  farmScenery: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  farmScroll: {
    flex: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  farmHeader: {
    position: "relative",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  farmLogo: {
    position: "absolute",
    left: "50%",
    width: 134,
    height: 56,
    marginLeft: -67,
  },
  farmHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#285B73",
    shadowOpacity: 0.16,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  farmHeaderButtonPressed: {
    opacity: 0.72,
  },
  farmBackIcon: {
    color: "#174A75",
    fontFamily: "Fredoka_700Bold",
    fontSize: 36,
    lineHeight: 38,
    marginTop: -3,
  },
  settingsIcon: {
    width: 34,
    height: 34,
  },
  farmHero: {
    height: 124,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    gap: 8,
  },
  farmSign: {
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    aspectRatio: 2.08,
    paddingHorizontal: 9,
    borderRadius: 16,
    backgroundColor: "#B8763F",
    borderWidth: 3,
    borderColor: "#8A4D2C",
    transform: [{ rotate: "-2deg" }],
    shadowColor: "#315D61",
    shadowOpacity: 0.2,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  farmSignSmall: {
    color: "#FFF1C7",
    fontFamily: "Fredoka_700Bold",
    fontSize: 14,
    lineHeight: 17,
    fontWeight: "700",
  },
  farmSignLarge: {
    color: "#FFF7D8",
    fontFamily: "Fredoka_700Bold",
    fontSize: 29,
    lineHeight: 32,
    fontWeight: "700",
  },
  farmLumi: {
    width: 122,
    height: 140,
    zIndex: 2,
  },
  farmInstruction: {
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 12,
    color: "#174A75",
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center",
  },
  farmActivityPanel: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    padding: 12,
    borderRadius: 26,
    backgroundColor: "rgba(255, 252, 243, 0.98)",
    shadowColor: "#356D73",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  farmProgressHeader: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
    gap: 8,
  },
  farmProgressStar: {
    color: "#F5B928",
    fontSize: 28,
    lineHeight: 30,
  },
  farmProgressCopy: {
    flex: 1,
  },
  farmProgressText: {
    color: "#174A75",
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    fontWeight: "700",
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
    fontFamily: "Nunito_500Medium",
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  farmRows: {
    gap: 6,
    paddingBottom: 2,
  },
  farmRowsScroll: {
    flex: 1,
    minHeight: 0,
  },
  farmActivityRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: "#E9F1F5",
  },
  farmActivityRowDone: {
    backgroundColor: "#E5F7D9",
  },
  farmActivityRowSelected: {
    backgroundColor: "#D9F2D0",
    borderWidth: 1.5,
    borderColor: "#70CD60",
  },
  farmActivityRowLocked: {
    backgroundColor: "#EDF2F5",
  },
  farmActivityRowPressed: {
    opacity: 0.75,
  },
  farmActivityNumber: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#91A7B8",
  },
  farmActivityNumberDone: {
    backgroundColor: "#35A943",
  },
  farmActivityNumberSelected: {
    backgroundColor: "#35A943",
  },
  farmActivityNumberLocked: {
    backgroundColor: "#AAB8C1",
  },
  farmActivityNumberText: {
    color: "#FFFFFF",
    fontFamily: "Fredoka_700Bold",
    fontSize: 14,
    fontWeight: "900",
  },
  farmActivityIconFrame: {
    width: 38,
    height: 38,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  farmActivityIcon: {
    width: 36,
    height: 36,
  },
  farmActivityTitle: {
    flex: 1,
    marginLeft: 7,
    color: "#175B31",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    fontWeight: "600",
  },
  farmActivityTitleLocked: {
    color: "#174A75",
  },
  farmActivityStatus: {
    width: 28,
    color: "#2FA644",
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
  },
  lockIcon: {
    width: 24,
    height: 27,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lockShackle: {
    position: "absolute",
    top: 1,
    width: 13,
    height: 14,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: "#456780",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  lockBody: {
    width: 21,
    height: 15,
    borderRadius: 4,
    backgroundColor: "#456780",
  },
  farmButtonArea: {
    width: "100%",
    marginTop: 14,
    paddingBottom: 4,
    paddingHorizontal: 0,
  },
  farmStartButton: {
    width: "100%",
    minHeight: 58,
    borderRadius: 22,
  },
  farmButtonText: {
    fontFamily: "Fredoka_700Bold",
    fontWeight: "700",
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