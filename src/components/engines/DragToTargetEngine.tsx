import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  completeDragPair,
  createDragSession,
  getDragPairKey,
  isDragSessionComplete,
  isDropInsideTarget,
  resetDragSession,
} from "../../engines/dragSession";
import {
  evaluateDragToTarget,
  getResponsiveDragFrames,
  getResponsiveDragStageHeight,
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
  draggable,
  target,
  pairIndex,
  pairCount,
  stageWidth,
  placedLabel,
  disabled,
  selected,
  onSelect,
  onAttempt,
  onComplete,
}: {
  draggable: ActivityItem;
  target: ActivityItem;
  pairIndex: number;
  pairCount: number;
  stageWidth: number;
  placedLabel: string;
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
      if (!finished) {
        completingRef.current = false;
        return;
      }
      setDropped(true);
      onComplete();
    });
  };

  const responder = useMemo(() => {
    const handleRelease = (
      _: unknown,
      gesture: { dx: number; dy: number },
    ) => {
      if (releaseHandledRef.current) return;
      releaseHandledRef.current = true;
      if (!isDropInsideTarget(frames.draggable, frames.target, gesture)) {
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
  }, [
    disabled,
    dropped,
    frames.draggable,
    frames.target,
    onAttempt,
    onComplete,
    position,
  ]);

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
        <Text style={styles.dropLabel}>
          {dropped ? placedLabel : target.label}
        </Text>
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
          accessibilityLabel={`${draggable.label} para ${target.label}`}
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
  const [session, setSession] = useState(() => createDragSession(activity.id));
  const sessionRef = useRef(session);
  const [selectedPairKey, setSelectedPairKey] = useState<string | null>(null);
  const [stageWidth, setStageWidth] = useState(320);

  useEffect(() => {
    const reset = resetDragSession(sessionRef.current, activity.id);
    sessionRef.current = reset;
    setSession(reset);
    setSelectedPairKey(null);
  }, [activity.id]);

  const pairs = activity.config.pairs.map((pair) => ({
    key: getDragPairKey(pair),
    draggable: activity.config.items.find(
      (item) => item.id === pair.draggableItemId,
    ),
    target: activity.config.items.find((item) => item.id === pair.targetId),
  }));

  if (pairs.some((pair) => !pair.draggable || !pair.target)) return null;

  const finishPair = (pairKey: string) => {
    const next = completeDragPair(sessionRef.current, pairKey);
    if (next === sessionRef.current) return;
    sessionRef.current = next;
    setSession(next);
    setSelectedPairKey(null);
    if (isDragSessionComplete(next, activity)) {
      onInteraction(evaluateDragToTarget(activity, true));
    }
  };

  const dragContent = (
    <>
      <View style={styles.dragHint}>
        <Text style={styles.dragHintText}>
          {activity.config.dragInstruction}
        </Text>
        <Text style={styles.dragArrow}>↓</Text>
      </View>
      {pairs.map((pair, index) => (
        <DraggablePair
          key={`${activity.id}:${pair.key}`}
          draggable={pair.draggable!}
          target={pair.target!}
          pairIndex={index}
          pairCount={pairs.length}
          stageWidth={stageWidth}
          placedLabel={activity.config.placedLabel}
          disabled={disabled}
          selected={selectedPairKey === pair.key}
          onSelect={() => setSelectedPairKey(pair.key)}
          onAttempt={() =>
            onInteraction(evaluateDragToTarget(activity, false))
          }
          onComplete={() => finishPair(pair.key)}
        />
      ))}
    </>
  );
  const contentHeight = getResponsiveDragStageHeight(pairs.length);

  if (pairs.length > 3) {
    return (
      <View
        onLayout={(event) => setStageWidth(event.nativeEvent.layout.width)}
        style={[styles.dragStage, styles.scrollStage]}
      >
        <ScrollView
          nestedScrollEnabled
          style={styles.dragScroll}
          contentContainerStyle={[
            styles.dragScrollContent,
            { height: contentHeight },
          ]}
        >
          {dragContent}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      onLayout={(event) => setStageWidth(event.nativeEvent.layout.width)}
      style={[styles.dragStage, { height: contentHeight }]}
    >
      {dragContent}
    </View>
  );
}

const styles = StyleSheet.create({
  dragStage: {
    width: "100%",
    maxWidth: 430,
    position: "relative",
    alignItems: "center",
  },
  scrollStage: { height: 295 },
  dragScroll: { width: "100%" },
  dragScrollContent: {
    width: "100%",
    position: "relative",
    alignItems: "center",
  },
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