import React, { useCallback, useEffect, useRef, useState } from "react";
import {
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
import { ActivityDefinition, ActivityInteraction, ActivityResult } from "../types";
import { colors } from "../theme/colors";

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
        <LumiSpeechBubble compact>{activity.instructionText}</LumiSpeechBubble>
        <AudioButton
          label={activity.audioLabel}
          text={activity.instructionText}
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
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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