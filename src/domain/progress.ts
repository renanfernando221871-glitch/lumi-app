import { ActivityDefinition, ProgressState, WorldDefinition } from "../types";

export type WorldLike =
  | Pick<WorldDefinition, "activityIds" | "rewardId">
  | readonly ActivityDefinition[];

function isActivityList(
  value: WorldLike,
): value is readonly ActivityDefinition[] {
  return Array.isArray(value);
}

export function getWorldActivityIds(world: WorldLike): string[] {
  return isActivityList(world)
    ? world.map((activity) => activity.id)
    : [...world.activityIds];
}

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
  rewardId = "lumi-flower",
): { progress: ProgressState; rewardGranted: boolean } {
  const knownIds = new Set(catalogIds);
  const completedActivityIds = knownIds.has(activityId)
    ? Array.from(new Set([...current.completedActivityIds, activityId]))
    : [...current.completedActivityIds];
  const allComplete = hasCompletedAllActivities(completedActivityIds, catalogIds);
  const rewardGranted =
    allComplete && !current.earnedRewardIds.includes(rewardId);

  return {
    progress: {
      completedActivityIds,
      earnedRewardIds: rewardGranted
        ? [...current.earnedRewardIds, rewardId]
        : [...current.earnedRewardIds],
    },
    rewardGranted,
  };
}

export function hasCompletedWorld(
  completedActivityIds: string[],
  world: WorldLike,
): boolean {
  return hasCompletedAllActivities(
    completedActivityIds,
    getWorldActivityIds(world),
  );
}

export const isWorldComplete = hasCompletedWorld;

export function completeWorldProgress(
  current: ProgressState,
  activityId: string,
  world: Pick<WorldDefinition, "activityIds" | "rewardId">,
): { progress: ProgressState; rewardGranted: boolean } {
  return completeActivityProgress(
    current,
    activityId,
    getWorldActivityIds(world),
    world.rewardId,
  );
}

export const completeWorldActivityProgress = completeWorldProgress;

export function getWorldCompletionDestination(
  rewardGranted: boolean,
  activityId: string,
  world: WorldLike,
): "reward" | "next" | "map" {
  const activityIds = getWorldActivityIds(world);
  const activityIndex = activityIds.indexOf(activityId);
  return getCompletionDestination(
    rewardGranted,
    activityIndex < 0 ? activityIds.length - 1 : activityIndex,
    activityIds.length,
  );
}

export function getCompletionDestination(
  rewardGranted: boolean,
  activityIndex: number,
  totalActivities: number,
): "reward" | "next" | "map" {
  if (rewardGranted) return "reward";
  return activityIndex === totalActivities - 1 ? "map" : "next";
}