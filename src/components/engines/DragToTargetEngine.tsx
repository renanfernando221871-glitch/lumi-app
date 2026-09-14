import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  evaluateDragToTarget,
  getResponsiveDragFrames,
} from "../../engines/interactions";
import {
  ActivityInteraction,
  ActivityItem,
  DragToTargetActivity,
} from "../../types";
import { colors, shadow } from "../../theme/colors";

function center(frame: { x: number; y: number; width: number; height: number }) {
  return {
    x: frame.x + frame.width / 2,
    y: frame.y + frame.height / 2,
  };
}

function DraggablePair({
  activity,
  draggable,
  target,
  pairIndex,
  pairCount,
  stageWidth,
  disabled,
  selected,
  onSelect,
  onAttempt,
  onComplete,
}: {
  activity: DragToTargetActivity;
  draggable: ActivityItem;
  target: ActivityItem;
  pairIndex: number;
  pairCount: number;
  stageWidth: number;
  disabled: boolean;
  selected: boolean;
  onSelect: () => void;
  onAttempt: () => void;
  onComplete: () => void;
}) {
  const frames = getResponsiveDragFrames(pairIndex, pairCount, stageWidth);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const releaseHandledRef = useRef(false);
  const completingRef = useRef(false);
  const [dropped, setDropped] = useState(false);
  const snapToTarget = () => {
    if (completingRef.current || dropped || disabled) return;
    completingRef.current = true;
    const sourceCenter = center(frames.draggable);
    const targetCenter = center(frames.target);
    Animated.spring(position, {
      toValue: {
        x: targetCenter.x - sourceCenter.x,
        y: targetCenter.y - sourceCenter.y,
      },
      useNativeDriver: false,
      speed: 16,
      bounciness: 5,
    }).start(({ finished }) => {
      if (!finished) return;
      setDropped(true);
      onComplete();
    });
  };

  const responder = useMemo(
    () => {
      const handleRelease = (
        _: unknown,
        gesture: { dx: number; dy: number },
      ) => {
        if (releaseHandledRef.current) return;
        releaseHandledRef.current = true;
        const sourceCenter = center(frames.draggable);
        const droppedCenter = {
          x: sourceCenter.x + gesture.dx,
          y: sourceCenter.y + gesture.dy,
        };
        const isInside =
          droppedCenter.x >= frames.target.x &&
          droppedCenter.x <= frames.target.x + frames.target.width &&
          droppedCenter.y >= frames.target.y &&
          droppedCenter.y <= frames.target.y + frames.target.height;

        if (!isInside) {
          completingRef.current = false;
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            bounciness: 8,
          }).start();
          onAttempt();
          return;
        }
        snapToTarget();
      };

      return PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) =>
          !dropped &&
          !disabled &&
          (Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3),
        onPanResponderMove: Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false },
        ),
        onPanResponderGrant: () => {
          releaseHandledRef.current = false;
        },
        onPanResponderEnd: handleRelease,
        onPanResponderRelease: handleRelease,
      });
    },
    [disabled, dropped, frames.draggable, frames.target, onAttempt, onComplete, position],
  );

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`lugar ${target.label}`}
        disabled={disabled || dropped || !selected}
        onPress={snapToTarget}
        style={({ pressed }) => [
          styles.dropZone,
          {
            left: frames.target.x,
            top: frames.target.y,
            width: frames.target.width,
            height: frames.target.height,
            backgroundColor: target.color,
          },
          selected && styles.dropZoneSelected,
          dropped && styles.dropZoneDone,
          pressed && styles.dropZonePressed,
        ]}
      >
        <Text style={pairCount === 1 ? styles.dropEmoji : styles.multiEmoji}>
          {target.emoji}
        </Text>
        <Text style={styles.dropLabel}>{dropped ? "Guardado!" : target.label}</Text>
      </Pressable>
      <Animated.View
        {...responder.panHandlers}
        pointerEvents={dropped || disabled ? "none" : "auto"}
        style={[
          styles.draggable,
          {
            left: frames.draggable.x,
            top: frames.draggable.y,
            width: frames.draggable.width,
            height: frames.draggable.height,
            backgroundColor: draggable.color,
            transform: [
              ...position.getTranslateTransform(),
              { scale: dropped ? 0.62 : 1 },
            ],
          },
        ]}
      >
        <Pressable
          accessibilityLabel={
            pairCount === 1
              ? `${draggable.label} para guardar`
              : `${draggable.label} para ${target.label}`
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: dropped || disabled, selected }}
          disabled={dropped || disabled}
          onPress={onSelect}
          style={styles.draggablePressable}
        >
          <Text style={styles.dragEmoji}>{draggable.emoji}</Text>
          <Text style={styles.dragLabel}>{draggable.label}</Text>
        </Pressable>
      </Animated.View>
    </>
  );
}

export type DragToTargetEngineProps = {
  activity: DragToTargetActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export function DragToTargetEngine({
  activity,
  onInteraction,
  disabled = false,
}: DragToTargetEngineProps) {
  const [completedPairs, setCompletedPairs] = useState<number[]>([]);
  const completedPairsRef = useRef(new Set<number>());
  const [selectedPair, setSelectedPair] = useState<number | null>(null);
  const [stageWidth, setStageWidth] = useState(320);
  const pairs = activity.config.pairs.map((pair) => ({
    draggable: activity.config.items.find(
      (item) => item.id === pair.draggableItemId,
    ),
    target: activity.config.items.find((item) => item.id === pair.targetId),
  }));

  if (pairs.some((pair) => !pair.draggable || !pair.target)) return null;

  const finishPair = (pairIndex: number) => {
    if (completedPairsRef.current.has(pairIndex)) return;
    completedPairsRef.current.add(pairIndex);
    const next = [...completedPairsRef.current];
    setCompletedPairs(next);
    setSelectedPair(null);
    if (next.length === pairs.length) {
      onInteraction(evaluateDragToTarget(activity, true));
    }
  };

  return (
    <View
      onLayout={(event) => setStageWidth(event.nativeEvent.layout.width)}
      style={[styles.dragStage, pairs.length > 1 && styles.multiStage]}
    >
      <View style={styles.dragHint}>
        <Text style={styles.dragHintText}>
          {pairs.length === 1 ? "Arraste até aqui" : "Cada objeto no seu lugar"}
        </Text>
        <Text style={styles.dragArrow}>↓</Text>
      </View>
      {pairs.map((pair, index) => (
        <DraggablePair
          key={`drag-${pair.draggable!.id}`}
          activity={activity}
          draggable={pair.draggable!}
          target={pair.target!}
          pairIndex={index}
          pairCount={pairs.length}
          stageWidth={stageWidth}
          disabled={disabled}
          selected={selectedPair === index}
          onSelect={() => setSelectedPair(index)}
          onAttempt={() =>
            onInteraction(evaluateDragToTarget(activity, false))
          }
          onComplete={() => finishPair(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dragStage: {
    width: "100%",
    maxWidth: 430,
    height: 300,
    position: "relative",
    alignItems: "center",
  },
  multiStage: { height: 295 },
  dragHint: { position: "absolute", top: 0, alignItems: "center" },
  dragHintText: { color: colors.blue, fontWeight: "800" },
  dragArrow: { color: colors.blue, fontSize: 24 },
  dropZone: {
    position: "absolute",
    borderRadius: 24,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  dropZoneDone: {
    borderStyle: "solid",
    borderColor: colors.green,
    backgroundColor: colors.softGreen,
  },
  dropZoneSelected: {
    borderColor: colors.blue,
    borderStyle: "solid",
  },
  dropZonePressed: { opacity: 0.78 },
  dropEmoji: { fontSize: 48 },
  multiEmoji: { fontSize: 35 },
  dropLabel: { color: colors.deepGreen, fontSize: 13, fontWeight: "800" },
  draggable: {
    position: "absolute",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  draggablePressable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dragEmoji: { fontSize: 42 },
  dragLabel: { color: colors.deepGreen, fontSize: 13, fontWeight: "800" },
});