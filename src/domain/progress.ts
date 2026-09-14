import { ProgressState } from "../types";

export function hasCompletedAllActivities(
  completedActivityIds: string[],
  catalogIds: string[],
) {
  const completed = new Set(completedActivityIds);
  return catalogIds.length > 0 && catalogIds.every((id) => completed.has(id));
}

export function completeActivityProgress(
  current: ProgressState,
  activityId: string,
  catalogIds: string[],
): { progress: ProgressState; rewardGranted: boolean } {
  const knownIds = new Set(catalogIds);
  const completedActivityIds = Array.from(
    new Set([...current.completedActivityIds, activityId]),
  ).filter((id) => knownIds.has(id));
  const allComplete = hasCompletedAllActivities(completedActivityIds, catalogIds);
  const rewardGranted = allComplete && !current.earnedReward;

  return {
    progress: {
      completedActivityIds,
      earnedReward: current.earnedReward || rewardGranted,
    },
    rewardGranted,
  };
}

export function getCompletionDestination(
  rewardGranted: boolean,
  activityIndex: number,
  totalActivities: number,
): "reward" | "next" | "map" {
  if (rewardGranted) return "reward";
  return activityIndex === totalActivities - 1 ? "map" : "next";
}