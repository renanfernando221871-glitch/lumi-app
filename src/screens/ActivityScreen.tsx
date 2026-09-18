import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { AudioButton } from "../components/AudioButton";
import { BackButton } from "../components/BackButton";
import { LeluaLogo } from "../components/LeluaLogo";
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

function FarmOfficialActivityViewport({
  accessibilityLabel,
  children,
  onBack,
  source,
}: {
  accessibilityLabel: string;
  children: React.ReactNode;
  onBack: () => void;
  source: ImageSourcePropType;
}) {
  return (
    <FarmActivityScreen accessibilityLabel={accessibilityLabel}>
      <ImageBackground
        resizeMode="stretch"
        source={source}
        style={styles.farmActivityBackground}
      />
      <FarmActivityHeader embedded onBack={onBack} />
      {children}
    </FarmActivityScreen>
  );
}

function FarmActivityScreen({
  accessibilityLabel,
  children,
}: {
  accessibilityLabel: string;
  children: React.ReactNode;
}) {
  const { height } = useWindowDimensions();
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.farmActivityScreen, { height, minHeight: height }]}
    >
      {children}
    </View>
  );
}

function FarmActivityHeader({
  embedded = false,
  onBack,
}: {
  embedded?: boolean;
  onBack: () => void;
}) {
  return (
    <View pointerEvents="box-none" style={styles.farmActivityHeader}>
      <Pressable
        accessibilityLabel="Voltar"
        accessibilityRole="button"
        onPress={onBack}
        style={[
          styles.farmActivityHeaderButton,
          embedded && styles.farmActivityEmbeddedButton,
        ]}
      >
        {!embedded ? <Text style={styles.farmActivityBack}>‹</Text> : null}
      </Pressable>
      {!embedded ? (
        <>
          <LeluaLogo
            compact
            accessibilityLabel="Leluá"
            style={styles.farmActivityLogo}
          />
          <View style={styles.farmActivityHeaderButton}>
            <Image
              accessibilityLabel="Configurações"
              source={require("../../assets/images/onboarding/guardian-home/settings-framed.png")}
              style={styles.farmActivitySettings}
            />
          </View>
        </>
      ) : null}
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
  const choose = (count: number) => {
    if (complete) return;
    onInteraction(evaluateCountAndSelect(activity, count));
  };

  return (
    <FarmOfficialActivityViewport
      accessibilityLabel={`Atividade ${activityNumber}: ${activity.title}`}
      onBack={onBack}
      source={require("../../attached_assets/farm-activity-4-lelua-official-viewport.png")}
    >
        {activity.config.options.map((option, index) => (
          <Pressable
            accessibilityLabel={`quantidade ${option}`}
            accessibilityRole="button"
            disabled={complete}
            key={option}
            onPress={() => choose(option)}
            style={[
              styles.farmCountOptionHotspot,
              { left: `${12 + index * 27}%` },
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
    </FarmOfficialActivityViewport>
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
  const isBrownAnimal = activity.id === "farm-brown-animal";
  const choose = (itemId: string) => {
    if (complete) return;
    onInteraction(evaluateTapAndFind(activity, itemId));
  };

  if (!isBrownAnimal) {
    const isFindHorse = activity.id === "farm-find-horse";
    return (
      <FarmOfficialActivityViewport
        accessibilityLabel={`Atividade ${activityNumber}: ${activity.title}`}
        onBack={onBack}
        source={
          isFindHorse
            ? complete
              ? require("../../attached_assets/farm-activity-2-lelua-selected-no-mock-status.png")
              : require("../../attached_assets/farm-activity-2-lelua-initial-no-mock-status.png")
            : require("../../attached_assets/farm-activity-1-lelua-no-mock-status.png")
        }
      >
        {activity.config.items.map((item, index) => (
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
            {!isFindHorse ? (
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
      </FarmOfficialActivityViewport>
    );
  }

  return (
    <FarmLayeredActivity
      accessibilityLabel={`Atividade ${activityNumber}: ${activity.title}`}
      activity={activity}
      complete={complete}
      feedback={feedback}
      onBack={onBack}
      onChoose={choose}
      onAdvance={onAdvance}
      advancing={advancing}
      activityNumber={activityNumber}
      total={total}
    />
  );
}

/**
 * The first three farm activities deliberately share one stage contract. The
 * character is not a separate asset: this crop window renders the supplied
 * full source image, keeping the original occlusion and proportions intact.
 */
function FarmLayeredActivity({
  accessibilityLabel,
  activity,
  activityNumber,
  total,
  feedback,
  complete,
  advancing,
  onBack,
  onChoose,
  onAdvance,
}: {
  accessibilityLabel: string;
  activity: TapAndFindActivity;
  activityNumber: number;
  total: number;
  feedback?: string;
  complete: boolean;
  advancing: boolean;
  onBack: () => void;
  onChoose: (itemId: string) => void;
  onAdvance: () => void;
}) {
  const items = [
    activity.config.items.find((item) => item.id === "white-sheep"),
    activity.config.items.find((item) => item.id === "brown-horse"),
    activity.config.items.find((item) => item.id === "yellow-chick"),
  ].filter((item): item is TapAndFindActivity["config"]["items"][number] =>
    Boolean(item),
  );
  const itemLabels: Record<string, string> = {
    "white-sheep": "ovelha",
    "brown-horse": "cavalo",
    "yellow-chick": "pintinho",
  };
  const itemCropTop: Record<string, number> = {
    "white-sheep": -336,
    "brown-horse": -400,
    "yellow-chick": -470,
  };

  return (
    <FarmActivityScreen accessibilityLabel={accessibilityLabel}>
      <Image
        accessibilityLabel="Paisagem da Fazenda"
        source={require("../../attached_assets/generated_images/farm-scenery-clean.png")}
        resizeMode="cover"
        style={styles.layeredScenery}
      />
      <View style={styles.layeredContent}>
        <FarmActivityHeader onBack={onBack} />
        <View style={styles.layeredHero}>
          <View style={styles.characterCrop} accessibilityLabel="Leluá na fazenda">
            <Image
              source={require("../../attached_assets/farm-activity-1-lelua-no-mock-status.png")}
              resizeMode="stretch"
              style={styles.characterSource}
            />
          </View>
          <View style={styles.layeredSign}>
            <Text style={styles.layeredSignSmall}>ATIVIDADE {activityNumber}</Text>
            <Text style={styles.layeredSignTitle}>{activity.title}</Text>
          </View>
        </View>
        <View style={styles.layeredProgress}>
          <Text style={styles.layeredStar}>★</Text>
          <Text style={styles.layeredProgressText}>{activityNumber} de 8 atividades</Text>
        </View>
        <View style={styles.layeredPrompt}>
          <Text style={styles.layeredPromptText}>{activity.instructionText}</Text>
        </View>
        <View style={styles.layeredCards}>
          {items.map((item) => (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="button"
              disabled={complete}
              key={item.id}
              onPress={() => onChoose(item.id)}
              style={({ pressed }) => [
                styles.layeredCard,
                complete && item.isTarget && styles.layeredCardCorrect,
                pressed && styles.layeredCardPressed,
              ]}
            >
              <View style={styles.layeredAnimalCrop}>
                <Image
                  accessibilityIgnoresInvertColors
                  source={require("../../attached_assets/generated_images/activity3-official-initial.png")}
                  resizeMode="stretch"
                  style={[
                    styles.layeredAnimalSource,
                    { top: itemCropTop[item.id] },
                  ]}
                />
              </View>
              <Text style={styles.layeredCardText}>
                {itemLabels[item.id] ?? item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {feedback && !complete ? (
          <Text accessibilityLiveRegion="polite" style={styles.layeredFeedback}>{feedback}</Text>
        ) : null}
        {complete ? (
          <>
            <CompletionNarration text={activity.successFeedback} />
            <Text accessibilityLiveRegion="polite" style={styles.layeredSuccess}>Muito bem! ✓</Text>
          </>
        ) : null}
        <Pressable
          accessibilityLabel={complete ? (activityNumber === total ? "Concluir mundo" : "Próxima atividade") : "Responder"}
          accessibilityRole="button"
          disabled={!complete || advancing}
          onPress={onAdvance}
          style={({ pressed }) => [styles.layeredAnswer, pressed && styles.layeredAnswerPressed]}
        >
          <Text style={styles.layeredAnswerText}>{complete ? (activityNumber === total ? "Concluir" : "Próxima") : "Responder"} <Text style={styles.layeredArrow}>›</Text></Text>
        </Pressable>
      </View>
    </FarmActivityScreen>
  );
}

const styles = StyleSheet.create({
  layeredScenery: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  layeredContent: { flex: 1, paddingHorizontal: 16, paddingTop: 124, paddingBottom: 78 },
  layeredHero: { height: 142, position: "relative" },
  layeredSign: { position: "absolute", top: 24, left: 96, zIndex: 2, width: 230, minHeight: 100, paddingHorizontal: 10, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "#B8763F", borderWidth: 3, borderColor: "#8A4D2C", transform: [{ rotate: "-2deg" }], elevation: 4 },
  layeredSignSmall: { color: "#FFF1C7", fontSize: 13, fontWeight: "800" },
  layeredSignTitle: { color: "#FFF7D8", fontSize: 25, lineHeight: 29, textAlign: "center", fontWeight: "900" },
  characterCrop: { position: "absolute", left: 4, top: 14, width: 82, height: 148, overflow: "hidden", zIndex: 1 },
  characterSource: { position: "absolute", width: 390, height: 844, left: -50, top: -138 },
  layeredProgress: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 20, height: 40, borderRadius: 22, backgroundColor: "#FFFDF5", elevation: 3, zIndex: 3 },
  layeredStar: { color: "#F5B928", fontSize: 23 },
  layeredProgressText: { color: "#174A75", fontSize: 15, fontWeight: "900" },
  layeredPrompt: { marginTop: 10, minHeight: 57, borderRadius: 28, alignItems: "center", justifyContent: "center", paddingHorizontal: 15, backgroundColor: "#EFF8FF", borderWidth: 2, borderColor: "#D6EBF4", zIndex: 3 },
  layeredPromptText: { color: "#174A75", fontSize: 17, textAlign: "center", fontWeight: "900" },
  layeredCards: { marginTop: 10, gap: 8, zIndex: 3 },
  layeredCard: { minHeight: 78, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, borderRadius: 24, backgroundColor: "rgba(255,253,247,0.96)", borderWidth: 2, borderColor: "#74BFF1", elevation: 2 },
  layeredCardCorrect: { borderColor: "#45B84A", backgroundColor: "#F0FFE8" },
  layeredCardPressed: { opacity: 0.72 },
  layeredAnimalCrop: { width: 86, height: 62, overflow: "hidden" },
  layeredAnimalSource: { position: "absolute", width: 275, height: 614, left: -36 },
  layeredCardText: { marginLeft: 12, color: "#165C9A", fontSize: 21, fontWeight: "900" },
  layeredFeedback: { marginTop: 7, color: "#A84F43", fontSize: 13, textAlign: "center", fontWeight: "900" },
  layeredSuccess: { alignSelf: "center", marginTop: 8, paddingHorizontal: 18, paddingVertical: 7, borderRadius: 18, backgroundColor: "#53B94A", color: "#FFF", fontSize: 14, fontWeight: "900" },
  layeredAnswer: { position: "absolute", left: 16, right: 16, bottom: 78, minHeight: 56, borderRadius: 30, alignItems: "center", justifyContent: "center", backgroundColor: "#45B84A", borderWidth: 3, borderColor: "#F4FFE9", elevation: 3 },
  layeredAnswerPressed: { opacity: 0.78 },
  layeredAnswerText: { color: "#FFF", fontSize: 22, fontWeight: "900" },
  layeredArrow: { fontSize: 30, lineHeight: 27 },
  farmActivityScreen: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#BCEFFF",
  },
  farmActivityBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  farmActivityHeader: {
    position: "absolute",
    top: 72,
    left: 16,
    right: 16,
    height: 52,
    zIndex: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  farmActivityHeaderButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFDF5", elevation: 3 },
  farmActivityEmbeddedButton: { backgroundColor: "transparent", elevation: 0 },
  farmActivityBack: { color: "#174A75", fontSize: 36, lineHeight: 38, marginTop: -4, fontWeight: "800" },
  farmActivityLogo: { position: "absolute", top: -8, left: "50%", width: 220, height: 90, marginLeft: -110 },
  farmActivitySettings: { width: 34, height: 34, resizeMode: "contain" },
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