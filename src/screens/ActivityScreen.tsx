import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { AudioButton } from "../components/AudioButton";
import { BackButton } from "../components/BackButton";
import { LumiSpeechBubble } from "../components/LumiSpeechBubble";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { PrimaryButton } from "../components/PrimaryButton";
import {
  applyActivityInteraction,
  canAdvanceActivity,
  createActivitySession,
  resetActivitySession,
} from "../domain/activitySession";
import { getActivityEngine } from "../engines/activityEngineRegistry";
import {
  ActivityDefinition,
  ActivityInteraction,
  ActivityResult,
  CountAndSelectActivity,
  TapAndFindActivity,
} from "../types";
import { colors } from "../theme/colors";
import {
  evaluateCountAndSelect,
  evaluateTapAndFind,
} from "../engines/interactions";
import {
  createSystemLumiVoiceService,
  LumiVoiceService,
} from "../audio/lumiVoiceService";

function CompletionNarration({ text }: { text: string }) {
  const [voiceService] = useState<LumiVoiceService>(() =>
    createSystemLumiVoiceService(() => undefined),
  );

  useEffect(() => {
    void voiceService.play({ text });
    return () => {
      void voiceService.dispose();
    };
  }, [text, voiceService]);

  return null;
}

type Props = {
  activity: ActivityDefinition;
  activityNumber: number;
  total: number;
  finalCompletionLabel: string;
  onBack: () => void;
  /** The optional argument preserves compatibility with the original App. */
  onComplete: (result?: ActivityResult) => void | Promise<void>;
};

export function ActivityScreen({
  activity,
  activityNumber,
  total,
  finalCompletionLabel,
  onBack,
  onComplete,
}: Props) {
  const compactHeader = useWindowDimensions().width < 480;
  const [session, setSession] = useState(() =>
    createActivitySession(activity.id),
  );
  const [attempts, setAttempts] = useState(0);
  const startedAtRef = useRef(Date.now());
  const completedAtRef = useRef<number | null>(null);
  const advancingRef = useRef(false);
  const Engine = getActivityEngine(activity.engineType);

  useEffect(() => {
    advancingRef.current = false;
    startedAtRef.current = Date.now();
    completedAtRef.current = null;
    setAttempts(0);
    setSession((current) => resetActivitySession(current, activity.id));
  }, [activity.id]);

  const handleInteraction = useCallback(
    ({ completed, feedback }: ActivityInteraction) => {
      setAttempts((current) => current + 1);
      if (completed) {
        completedAtRef.current = Date.now();
      }
      setSession((current) =>
        applyActivityInteraction(
          current,
          { completed, feedback },
          activity.successFeedback,
        ),
      );
    },
    [activity.successFeedback],
  );

  const advance = async () => {
    if (!canAdvanceActivity(session) || advancingRef.current) return;
    advancingRef.current = true;
    setSession((current) => ({ ...current, advancing: true }));
    try {
      await onComplete({
        activityId: activity.id,
        completed: true,
        attempts,
        startedAt: startedAtRef.current,
        completedAt: completedAtRef.current ?? Date.now(),
      });
    } catch {
      advancingRef.current = false;
      setSession((current) => ({
        ...current,
        advancing: false,
        feedback: "Não consegui salvar agora. Toque novamente.",
      }));
    }
  };

  if (
    (activity.id === "farm-who-moo" ||
      activity.id === "farm-find-horse" ||
      activity.id === "farm-brown-animal") &&
    activity.engineType === "tap-and-find"
  ) {
    return (
      <FarmOfficialTapActivity
        activity={activity}
        activityNumber={activityNumber}
        total={total}
        feedback={session.feedback}
        complete={session.complete}
        advancing={session.advancing}
        onBack={onBack}
        onInteraction={handleInteraction}
        onAdvance={advance}
      />
    );
  }

  if (
    activity.id === "farm-count-chicks" &&
    activity.engineType === "count-and-select"
  ) {
    return (
      <FarmCountChicksActivity
        activity={activity}
        activityNumber={activityNumber}
        total={total}
        feedback={session.feedback}
        complete={session.complete}
        advancing={session.advancing}
        onBack={onBack}
        onInteraction={handleInteraction}
        onAdvance={advance}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <BackButton onPress={onBack} />
        <ProgressIndicator current={activityNumber - 1} total={total} />
        <View style={[styles.topSpacer, compactHeader && styles.compactTopSpacer]} />
      </View>
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.kicker}>ATIVIDADE {activityNumber}</Text>
        <Text style={styles.title}>{activity.title}</Text>
        <LumiSpeechBubble
          compact
          expression={session.complete ? "happy" : session.feedback ? "encouraging" : "curious"}
        >
          {activity.instructionText}
        </LumiSpeechBubble>
        <AudioButton
          label={activity.audioLabel}
          text={activity.audioText ?? activity.instructionText}
          audioFile={activity.instructionAudio}
        />
        <View style={styles.stage}>
          <Engine
            key={activity.id}
            activity={activity}
            onInteraction={handleInteraction}
            disabled={session.complete}
          />
        </View>
        <Text style={[styles.helper, session.feedback && styles.feedback]}>
          {session.feedback || activity.hint}
        </Text>
        {session.complete ? (
          <>
            {activity.completionAudioText ? (
              <CompletionNarration text={activity.completionAudioText} />
            ) : null}
            <PrimaryButton
              label={
                activityNumber === total
                  ? finalCompletionLabel
                  : "Próxima atividade"
              }
              onPress={advance}
              variant="green"
              disabled={session.advancing}
              style={styles.nextButton}
            />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function FarmCountChicksActivity({
  activity,
  activityNumber,
  total,
  feedback,
  complete,
  advancing,
  onBack,
  onInteraction,
  onAdvance,
}: {
  activity: CountAndSelectActivity;
  activityNumber: number;
  total: number;
  feedback?: string;
  complete: boolean;
  advancing: boolean;
  onBack: () => void;
  onInteraction: (interaction: ActivityInteraction) => void;
  onAdvance: () => void;
}) {
  const { height } = useWindowDimensions();
  const choose = (count: number) => {
    if (complete) return;
    onInteraction(evaluateCountAndSelect(activity, count));
  };

  return (
    <View style={[styles.farmActivityScreen, { minHeight: height }]}>
      <ImageBackground
        accessibilityLabel={`Atividade ${activityNumber}: ${activity.title}`}
        imageStyle={styles.farmActivityBackgroundImage}
        resizeMode="cover"
        source={require("../../attached_assets/farm-activity-4-no-mock-status.png")}
        style={[styles.farmActivityBackground, { height }]}
      >
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.farmActivityBackHotspot}
        />
        {activity.config.options.map((option, index) => (
          <Pressable
            accessibilityLabel={`quantidade ${option}`}
            accessibilityRole="button"
            disabled={complete}
            key={option}
            onPress={() => choose(option)}
            style={[
              styles.farmCountOptionHotspot,
              { left: `${13 + index * 27}%` },
            ]}
          />
        ))}
        {feedback && !complete ? (
          <View accessibilityLiveRegion="polite" style={styles.farmRetryBubble}>
            <Text style={styles.farmRetryText}>{feedback}</Text>
          </View>
        ) : null}
        {complete ? (
          <>
            <CompletionNarration text={activity.successFeedback} />
            <View
              accessibilityLiveRegion="polite"
              style={styles.farmCountSuccessBadge}
            >
              <Text style={styles.farmSuccessText}>Muito bem! ✓</Text>
            </View>
            <Pressable
              accessibilityLabel={
                activityNumber === total
                  ? "Concluir mundo"
                  : "Próxima atividade"
              }
              accessibilityRole="button"
              disabled={advancing}
              onPress={onAdvance}
              style={styles.farmAnswerHotspot}
            />
          </>
        ) : null}
      </ImageBackground>
    </View>
  );
}

function FarmOfficialTapActivity({
  activity,
  activityNumber,
  total,
  feedback,
  complete,
  advancing,
  onBack,
  onInteraction,
  onAdvance,
}: {
  activity: TapAndFindActivity;
  activityNumber: number;
  total: number;
  feedback?: string;
  complete: boolean;
  advancing: boolean;
  onBack: () => void;
  onInteraction: (interaction: ActivityInteraction) => void;
  onAdvance: () => void;
}) {
  const { height } = useWindowDimensions();
  const isFindHorse = activity.id === "farm-find-horse";
  const isBrownAnimal = activity.id === "farm-brown-animal";
  const displayedItems = isBrownAnimal
    ? [
        activity.config.items.find((item) => item.id === "white-sheep"),
        activity.config.items.find((item) => item.id === "brown-horse"),
        activity.config.items.find((item) => item.id === "yellow-chick"),
      ].filter((item): item is TapAndFindActivity["config"]["items"][number] =>
        Boolean(item),
      )
    : activity.config.items;
  const choose = (itemId: string) => {
    if (complete) return;
    onInteraction(evaluateTapAndFind(activity, itemId));
  };

  return (
    <View style={[styles.farmActivityScreen, { minHeight: height }]}>
      <ImageBackground
        accessibilityLabel={`Atividade ${activityNumber}: ${activity.title}`}
        imageStyle={styles.farmActivityBackgroundImage}
        resizeMode="cover"
        source={
          isBrownAnimal
            ? complete
              ? require("../../attached_assets/farm-activity-3-no-mock-status.png")
              : require("../../attached_assets/lumi-farm-activity-3-initial-no-mock-status.png")
            : isFindHorse
            ? complete
              ? require("../../attached_assets/farm-activity-2-no-mock-status.png")
              : require("../../attached_assets/lumi-farm-activity-2-initial-no-mock-status.png")
            : require("../../attached_assets/farm-activity-1-no-mock-status.png")
        }
        style={[styles.farmActivityBackground, { height }]}
      >
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.farmActivityBackHotspot}
        />
        {displayedItems.map((item, index) => (
          <Pressable
            accessibilityLabel={item.label}
            accessibilityRole="button"
            disabled={complete}
            key={item.id}
            onPress={() => choose(item.id)}
            style={[
              styles.farmAnimalHotspot,
              { top: `${43.8 + index * 12.6}%` },
            ]}
          />
        ))}
        {feedback && !complete ? (
          <View accessibilityLiveRegion="polite" style={styles.farmRetryBubble}>
            <Text style={styles.farmRetryText}>{feedback}</Text>
          </View>
        ) : null}
        {complete ? (
          <>
            <CompletionNarration text={activity.successFeedback} />
            {!isFindHorse && !isBrownAnimal ? (
              <View
                accessibilityLiveRegion="polite"
                style={styles.farmSuccessBadge}
              >
                <Text style={styles.farmSuccessText}>Muito bem! ✓</Text>
              </View>
            ) : null}
            <Pressable
              accessibilityLabel={
                activityNumber === total
                  ? "Concluir mundo"
                  : "Próxima atividade"
              }
              accessibilityRole="button"
              disabled={advancing}
              onPress={onAdvance}
              style={styles.farmAnswerHotspot}
            />
          </>
        ) : null}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  farmActivityScreen: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#BCEFFF",
  },
  farmActivityBackground: {
    width: "100%",
  },
  farmActivityBackgroundImage: {
    transform: [{ scale: 1.045 }],
  },
  farmActivityBackHotspot: {
    position: "absolute",
    top: "7%",
    left: "4%",
    width: "17%",
    height: "9%",
    borderRadius: 40,
    zIndex: 2,
  },
  farmAnimalHotspot: {
    position: "absolute",
    left: "8%",
    width: "84%",
    height: "11.5%",
    borderRadius: 28,
  },
  farmCountOptionHotspot: {
    position: "absolute",
    top: "66.2%",
    width: "22%",
    height: "12%",
    borderRadius: 24,
  },
  farmAnswerHotspot: {
    position: "absolute",
    left: "12%",
    bottom: "8.5%",
    width: "76%",
    height: "9%",
    borderRadius: 40,
  },
  farmRetryBubble: {
    position: "absolute",
    left: "16%",
    right: "16%",
    bottom: "6.5%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "rgba(255, 248, 233, 0.96)",
  },
  farmRetryText: {
    color: "#A84F43",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  farmSuccessBadge: {
    position: "absolute",
    left: "31%",
    right: "31%",
    bottom: "18%",
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "rgba(83, 185, 74, 0.96)",
  },
  farmCountSuccessBadge: {
    position: "absolute",
    left: "33%",
    right: "33%",
    bottom: "18.5%",
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "rgba(83, 185, 74, 0.96)",
  },
  farmSuccessText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },
  screen: { flex: 1, backgroundColor: colors.cream },
  topBar: {
    width: "100%",
    maxWidth: 820,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topSpacer: { width: 76 },
  compactTopSpacer: { width: 0 },
  contentScroll: { width: "100%", flex: 1 },
  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 36,
  },
  kicker: {
    color: colors.coral,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  title: {
    color: colors.deepGreen,
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    fontWeight: "900",
    marginTop: 3,
    marginBottom: 15,
  },
  stage: {
    width: "100%",
    minHeight: 270,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  helper: {
    minHeight: 24,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  feedback: { color: colors.green },
  nextButton: {
    width: "100%",
    maxWidth: 360,
    marginTop: 15,
  },
});