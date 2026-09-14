import { DragToTargetActivity } from "../types";
import { DragFrame } from "./interactions";

export type DragSession = {
  activityId: string;
  completedPairKeys: readonly string[];
};

export function getDragPairKey(
  pair: DragToTargetActivity["config"]["pairs"][number],
): string {
  return `${pair.draggableItemId}\u0000${pair.targetId}`;
}

export function createDragSession(activityId: string): DragSession {
  return { activityId, completedPairKeys: [] };
}

export function resetDragSession(
  session: DragSession,
  activityId: string,
): DragSession {
  return session.activityId === activityId
    ? session
    : createDragSession(activityId);
}

export function completeDragPair(
  session: DragSession,
  pairKey: string,
): DragSession {
  if (session.completedPairKeys.includes(pairKey)) return session;
  return {
    ...session,
    completedPairKeys: [...session.completedPairKeys, pairKey],
  };
}

export function isDragSessionComplete(
  session: DragSession,
  activity: DragToTargetActivity,
): boolean {
  return activity.config.pairs.every((pair) =>
    session.completedPairKeys.includes(getDragPairKey(pair)),
  );
}

export function isDropInsideTarget(
  draggable: DragFrame,
  target: DragFrame,
  delta: { dx: number; dy: number },
): boolean {
  const droppedCenter = {
    x: draggable.x + draggable.width / 2 + delta.dx,
    y: draggable.y + draggable.height / 2 + delta.dy,
  };
  return (
    droppedCenter.x >= target.x &&
    droppedCenter.x <= target.x + target.width &&
    droppedCenter.y >= target.y &&
    droppedCenter.y <= target.y + target.height
  );
}