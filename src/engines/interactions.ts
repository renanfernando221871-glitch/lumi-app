import {
  ActivityInteraction,
  CountAndSelectActivity,
  DragToTargetActivity,
  OrderingActivity,
  TapAndFindActivity,
} from "../types";
import { evaluateOrdering as evaluateOrderingState } from "./ordering";

export function evaluateTapAndFind(
  activity: TapAndFindActivity,
  selectedItemId: string,
): ActivityInteraction {
  return selectedItemId === activity.config.targetId
    ? { completed: true }
    : { completed: false, feedback: activity.retryFeedback };
}

export function evaluateCountAndSelect(
  activity: CountAndSelectActivity,
  selectedCount: number,
): ActivityInteraction {
  return selectedCount === activity.config.targetCount
    ? { completed: true }
    : { completed: false, feedback: activity.retryFeedback };
}

export function evaluateDragToTarget(
  activity: DragToTargetActivity,
  droppedInsideTarget: boolean,
): ActivityInteraction {
  return droppedInsideTarget
    ? { completed: true }
    : { completed: false, feedback: activity.retryFeedback };
}

export function evaluateOrdering(
  activity: OrderingActivity,
  selectedItemIds: readonly string[],
) {
  return evaluateOrderingState(activity, selectedItemIds);
}

export type DragFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function getResponsiveDragFrames(
  index: number,
  total: number,
  stageWidth: number,
): { draggable: DragFrame; target: DragFrame } {
  const width = Math.max(280, Math.min(stageWidth, 430));
  if (total === 1) {
    const draggableWidth = Math.min(128, width * 0.34);
    const targetWidth = Math.min(144, width * 0.38);
    return {
      draggable: {
        x: 18,
        y: 135,
        width: draggableWidth,
        height: 112,
      },
      target: {
        x: width - targetWidth - 18,
        y: 78,
        width: targetWidth,
        height: 126,
      },
    };
  }
  const columns = Math.min(3, total);
  const row = Math.floor(index / columns);
  const column = index % columns;
  const slotWidth = width / columns;
  const cardWidth = Math.max(72, Math.min(100, slotWidth - 12));
  const x = column * slotWidth + (slotWidth - cardWidth) / 2;
  const rowOffset = row * 250;
  return {
    draggable: { x, y: 190 + rowOffset, width: cardWidth, height: 88 },
    target: { x, y: 45 + rowOffset, width: cardWidth, height: 98 },
  };
}

export function getResponsiveDragStageHeight(total: number): number {
  if (total <= 1) return 300;
  return 45 + Math.ceil(total / 3) * 250;
}