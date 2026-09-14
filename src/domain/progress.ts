import { ActivityDefinition, ProgressState, WorldDefinition } from "../types";

export type WorldLike =
  | Pick<WorldDefinition, "activityIds" | "rewardId">
  | readonly ActivityDefinition[];

export function isWorldUnlocked(
  world: Pick<WorldDefinition, "unlock">,
  completedActivityIds: readonly string[] | ProgressState,
  catalog: readonly WorldDefinition[],
): boolean {
  if (world.unlock.unlockedByDefault) return true;
  const prerequisiteId = world.unlock.prerequisiteWorldId;
  if (!prerequisiteId) return false;
  const prerequisite = catalog.find((candidate) => candidate.id === prerequisiteId);
  const completedIds = Array.isArray(completedActivityIds)
    ? completedActivityIds
    : (completedActivityIds as ProgressState).completedActivityIds;
  return prerequisite
    ? hasCompletedWorld([...completedIds], prerequisite)
    : false;
}

export function getUnlockedWorldIds(
  catalog: readonly WorldDefinition[],
  completedActivityIds: readonly string[],
): string[] {
  return catalog
    .filter((world) => isWorldUnlocked(world, completedActivityIds, catalog))
    .map((world) => world.id);
}

export const isWorldAvailable = isWorldUnlocked;

export function getNextIncompleteActivityId(
  world: Pick<WorldDefinition, "activityIds">,
  completedActivityIds: readonly string[],
): string | undefined {
  return world.activityIds.find((id) => !completedActivityIds.includes(id));
}

export function getNextWorldActivityId(
  world: Pick<WorldDefinition, "activityIds">,
  currentActivityId: string,
): string | undefined {
  const currentIndex = world.activityIds.indexOf(currentActivityId);
  return currentIndex >= 0
    ? world.activityIds[currentIndex + 1]
    : undefined;
}

export type WorldProgressionDestination =
  | { type: "activity"; activityId: string }
  | { type: "reward"; rewardId: string }
  | { type: "map" };

export function getWorldProgressionDestination(
  world: Pick<WorldDefinition, "activityIds" | "rewardId">,
  currentActivityId: string,
  rewardGranted: boolean,
): WorldProgressionDestination {
  const nextActivityId = getNextWorldActivityId(world, currentActivityId);
  if (nextActivityId) {
    return { type: "activity", activityId: nextActivityId };
  }
  return rewardGranted
    ? { type: "reward", rewardId: world.rewardId }
    : { type: "map" };
}

export function canStartActivity(
  world: Pick<WorldDefinition, "activityIds">,
  activityId: string,
  completedActivityIds: readonly string[],
): boolean {
  const next = getNextIncompleteActivityId(world, completedActivityIds);
  return next === activityId || (!next && world.activityIds.includes(activityId));
}

export function canOpenWorld(
  world: WorldDefinition,
  completedActivityIds: readonly string[] | ProgressState,
  catalog: readonly WorldDefinition[],
): boolean {
  return isWorldUnlocked(world, completedActivityIds, catalog);
}

export function canStartWorldActivity(
  world: WorldDefinition,
  activityId: string,
  completedActivityIds: readonly string[] | ProgressState,
  catalog: readonly WorldDefinition[],
): boolean {
  if (!canOpenWorld(world, completedActivityIds, catalog)) return false;
  const completedIds = Array.isArray(completedActivityIds)
    ? completedActivityIds
    : (completedActivityIds as ProgressState).completedActivityIds;
  return canStartActivity(world, activityId, completedIds);
}

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
  const result = completeActivityProgress(
    current,
    activityId,
    getWorldActivityIds(world),
    world.rewardId,
  );
  const isLastActivity =
    world.activityIds[world.activityIds.length - 1] === activityId;
  if (result.rewardGranted && !isLastActivity) {
    return {
      progress: {
        ...result.progress,
        earnedRewardIds: result.progress.earnedRewardIds.filter(
          (rewardId) => rewardId !== world.rewardId,
        ),
      },
      rewardGranted: false,
    };
  }
  return result;
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