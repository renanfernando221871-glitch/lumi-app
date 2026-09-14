import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutRectangle,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AudioButton } from "../components/AudioButton";
import { BackButton } from "../components/BackButton";
import { LumiSpeechBubble } from "../components/LumiSpeechBubble";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, shadow } from "../theme/colors";
import { ActivityDefinition } from "../types";

type Props = {
  activity: ActivityDefinition;
  activityNumber: number;
  total: number;
  onBack: () => void;
  onComplete: () => void;
};

export function ActivityScreen({
  activity,
  activityNumber,
  total,
  onBack,
  onComplete,
}: Props) {
  const [feedback, setFeedback] = useState("");
  const [complete, setComplete] = useState(false);

  const finish = () => {
    setComplete(true);
    setFeedback(activity.reward);
  };

  const choose = (id: string) => {
    if (id === activity.targetId) {
      finish();
    } else {
      setFeedback("Quase! Vamos olhar mais uma vez juntos.");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <BackButton onPress={onBack} />
        <ProgressIndicator current={activityNumber - 1} total={total} />
        <View style={styles.topSpacer} />
      </View>
      <View style={styles.content}>
        <Text style={styles.kicker}>ATIVIDADE {activityNumber}</Text>
        <Text style={styles.title}>{activity.title}</Text>
        <LumiSpeechBubble compact>{activity.instruction}</LumiSpeechBubble>
        <AudioButton label={activity.audioLabel} />
        <View style={styles.stage}>
          {activity.kind === "find" ? (
            <FindActivity activity={activity} onChoose={choose} />
          ) : activity.kind === "color" ? (
            <ColorActivity activity={activity} onChoose={choose} />
          ) : (
            <DragActivity activity={activity} onComplete={finish} />
          )}
        </View>
        <Text style={[styles.helper, feedback && styles.feedback]}>
          {feedback || activity.helper}
        </Text>
        {complete ? (
          <PrimaryButton
            label={activityNumber === total ? "Ver minha flor" : "Próxima atividade"}
            onPress={onComplete}
            variant="green"
            style={styles.nextButton}
          />
        ) : null}
      </View>
    </View>
  );
}

function FindActivity({
  activity,
  onChoose,
}: {
  activity: ActivityDefinition;
  onChoose: (id: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {activity.items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPress={() => onChoose(item.id)}
          style={({ pressed }) => [
            styles.itemCard,
            { backgroundColor: item.color, transform: [{ scale: pressed ? 0.96 : 1 }] },
          ]}
        >
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
          <Text style={styles.itemLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ColorActivity({
  activity,
  onChoose,
}: {
  activity: ActivityDefinition;
  onChoose: (id: string) => void;
}) {
  return (
    <View style={styles.colorOptions}>
      {activity.items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPress={() => onChoose(item.id)}
          style={({ pressed }) => [
            styles.colorCard,
            { borderColor: item.color, opacity: pressed ? 0.72 : 1 },
          ]}
        >
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          <Text style={styles.colorEmoji}>{item.emoji}</Text>
          <Text style={styles.colorLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function DragActivity({
  activity,
  onComplete,
}: {
  activity: ActivityDefinition;
  onComplete: () => void;
}) {
  const teddy = activity.items.find((item) => item.id === "teddy")!;
  const target = activity.items.find((item) => item.id === activity.targetId)!;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [dropped, setDropped] = useState(false);
  const [targetLayout, setTargetLayout] = useState<LayoutRectangle | null>(null);
  const teddyFrame = { x: 42, y: 105, width: 128, height: 112 };
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !dropped,
        onMoveShouldSetPanResponder: (_, gesture) =>
          !dropped && (Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3),
        onPanResponderMove: Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false },
        ),
        onPanResponderRelease: (_, gesture) => {
          const teddyCenter = {
            x: teddyFrame.x + teddyFrame.width / 2 + gesture.dx,
            y: teddyFrame.y + teddyFrame.height / 2 + gesture.dy,
          };
          const isInsideTarget =
            targetLayout !== null &&
            teddyCenter.x >= targetLayout.x &&
            teddyCenter.x <= targetLayout.x + targetLayout.width &&
            teddyCenter.y >= targetLayout.y &&
            teddyCenter.y <= targetLayout.y + targetLayout.height;

          if (isInsideTarget && targetLayout) {
            const snapPosition = {
              x:
                targetLayout.x +
                targetLayout.width / 2 -
                (teddyFrame.x + teddyFrame.width / 2),
              y:
                targetLayout.y +
                targetLayout.height / 2 -
                (teddyFrame.y + teddyFrame.height / 2),
            };

            Animated.spring(position, {
              toValue: snapPosition,
              useNativeDriver: false,
              speed: 16,
              bounciness: 5,
            }).start(({ finished }) => {
              if (!finished) return;
              setDropped(true);
              onComplete();
            });
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              bounciness: 8,
            }).start();
          }
        },
      }),
    [dropped, onComplete, position, targetLayout],
  );

  return (
    <View style={styles.dragStage}>
      <View style={styles.dragHint}>
        <Text style={styles.dragHintText}>Arraste até aqui</Text>
        <Text style={styles.dragArrow}>↓</Text>
      </View>
      <View
        onLayout={(event) => setTargetLayout(event.nativeEvent.layout)}
        style={[styles.dropZone, dropped && styles.dropZoneDone]}
      >
        <Text style={styles.dropEmoji}>{target.emoji}</Text>
        <Text style={styles.dropLabel}>{dropped ? "Guardado!" : target.label}</Text>
      </View>
      <Animated.View
        {...responder.panHandlers}
        accessibilityLabel="ursinho para guardar"
        accessibilityRole="button"
        accessibilityState={{ disabled: dropped }}
        pointerEvents={dropped ? "none" : "auto"}
        style={[
          styles.draggable,
          {
            backgroundColor: teddy.color,
            transform: [
              ...position.getTranslateTransform(),
              { scale: dropped ? 0.62 : 1 },
            ],
          },
        ]}
      >
        <Text style={styles.dragEmoji}>{teddy.emoji}</Text>
        <Text style={styles.dragLabel}>{teddy.label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
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
  topSpacer: {
    width: 76,
  },
  content: {
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
  grid: {
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  itemCard: {
    width: 145,
    height: 116,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  itemEmoji: {
    fontSize: 47,
  },
  itemLabel: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 3,
  },
  colorOptions: {
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  colorCard: {
    width: 150,
    minHeight: 110,
    borderWidth: 4,
    borderRadius: 22,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  colorDot: {
    position: "absolute",
    top: 9,
    right: 11,
    width: 15,
    height: 15,
    borderRadius: 8,
  },
  colorEmoji: {
    fontSize: 41,
  },
  colorLabel: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 1,
  },
  helper: {
    minHeight: 24,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  feedback: {
    color: colors.green,
  },
  nextButton: {
    width: "100%",
    maxWidth: 360,
    marginTop: 15,
  },
  dragStage: {
    width: "100%",
    maxWidth: 430,
    height: 270,
    position: "relative",
    alignItems: "center",
  },
  dragHint: {
    position: "absolute",
    top: 0,
    alignItems: "center",
  },
  dragHintText: {
    color: colors.blue,
    fontWeight: "800",
  },
  dragArrow: {
    color: colors.blue,
    fontSize: 28,
  },
  dropZone: {
    position: "absolute",
    top: 78,
    right: 25,
    width: 144,
    height: 126,
    borderRadius: 24,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: colors.yellow,
    backgroundColor: colors.softYellow,
    alignItems: "center",
    justifyContent: "center",
  },
  dropZoneDone: {
    borderStyle: "solid",
    borderColor: colors.green,
    backgroundColor: colors.softGreen,
  },
  dropEmoji: {
    fontSize: 48,
  },
  dropLabel: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "800",
  },
  draggable: {
    position: "absolute",
    left: 42,
    top: 105,
    width: 128,
    height: 112,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  dragEmoji: {
    fontSize: 48,
  },
  dragLabel: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "800",
  },
});