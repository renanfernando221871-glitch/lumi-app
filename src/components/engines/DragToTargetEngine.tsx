import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutRectangle,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityInteraction, DragToTargetActivity } from "../../types";
import { evaluateDragToTarget } from "../../engines/interactions";
import { colors, shadow } from "../../theme/colors";

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
  const draggable = activity.config.items.find(
    (item) => item.id === activity.config.draggableItemId,
  );
  const target = activity.config.items.find(
    (item) => item.id === activity.config.targetId,
  );
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [dropped, setDropped] = useState(false);
  const [targetLayout, setTargetLayout] = useState<LayoutRectangle | null>(null);
  const draggableFrame = { x: 42, y: 105, width: 128, height: 112 };

  if (!draggable || !target) {
    // Catalog validation catches this in development. Keeping the render
    // explicit avoids an unsafe non-null assertion for data loaded externally.
    return null;
  }

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !dropped && !disabled,
        onMoveShouldSetPanResponder: (_, gesture) =>
          !dropped &&
          !disabled &&
          (Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3),
        onPanResponderMove: Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false },
        ),
        onPanResponderRelease: (_, gesture) => {
          const draggableCenter = {
            x:
              draggableFrame.x +
              draggableFrame.width / 2 +
              gesture.dx,
            y:
              draggableFrame.y +
              draggableFrame.height / 2 +
              gesture.dy,
          };
          const isInsideTarget =
            targetLayout !== null &&
            draggableCenter.x >= targetLayout.x &&
            draggableCenter.x <= targetLayout.x + targetLayout.width &&
            draggableCenter.y >= targetLayout.y &&
            draggableCenter.y <= targetLayout.y + targetLayout.height;

          if (isInsideTarget && targetLayout) {
            const snapPosition = {
              x:
                targetLayout.x +
                targetLayout.width / 2 -
                (draggableFrame.x + draggableFrame.width / 2),
              y:
                targetLayout.y +
                targetLayout.height / 2 -
                (draggableFrame.y + draggableFrame.height / 2),
            };

            Animated.spring(position, {
              toValue: snapPosition,
              useNativeDriver: false,
              speed: 16,
              bounciness: 5,
            }).start(({ finished }) => {
              if (!finished) return;
              setDropped(true);
              onInteraction(evaluateDragToTarget(activity, true));
            });
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              bounciness: 8,
            }).start();
            // The original drag activity keeps its hint visible after a
            // miss; attempts are still recorded in the shared result.
            onInteraction(evaluateDragToTarget(activity, false));
          }
        },
      }),
    [disabled, dropped, onInteraction, position, targetLayout],
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
        accessibilityLabel={`${draggable.label} para guardar`}
        accessibilityRole="button"
        accessibilityState={{ disabled: dropped || disabled }}
        pointerEvents={dropped || disabled ? "none" : "auto"}
        style={[
          styles.draggable,
          {
            backgroundColor: draggable.color,
            transform: [
              ...position.getTranslateTransform(),
              { scale: dropped ? 0.62 : 1 },
            ],
          },
        ]}
      >
        <Text style={styles.dragEmoji}>{draggable.emoji}</Text>
        <Text style={styles.dragLabel}>{draggable.label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dragStage: {
    width: "100%",
    maxWidth: 430,
    height: 270,
    position: "relative",
    alignItems: "center",
  },
  dragHint: { position: "absolute", top: 0, alignItems: "center" },
  dragHintText: { color: colors.blue, fontWeight: "800" },
  dragArrow: { color: colors.blue, fontSize: 28 },
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
  dropEmoji: { fontSize: 48 },
  dropLabel: { color: colors.deepGreen, fontSize: 14, fontWeight: "800" },
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
  dragEmoji: { fontSize: 48 },
  dragLabel: { color: colors.deepGreen, fontSize: 14, fontWeight: "800" },
});