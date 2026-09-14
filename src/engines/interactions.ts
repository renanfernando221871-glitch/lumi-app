import {
  ActivityInteraction,
  DragToTargetActivity,
  TapAndFindActivity,
} from "../types";

export function evaluateTapAndFind(
  activity: TapAndFindActivity,
  selectedItemId: string,
): ActivityInteraction {
  return selectedItemId === activity.config.targetId
    ? { completed: true }
    : { completed: false, feedback: activity.feedbackAttempt };
}

export function evaluateDragToTarget(
  _activity: DragToTargetActivity,
  droppedInsideTarget: boolean,
): ActivityInteraction {
  return droppedInsideTarget
    ? { completed: true }
    : { completed: false };
}