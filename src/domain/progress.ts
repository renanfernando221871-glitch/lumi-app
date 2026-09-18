import { ProgressState, WorldDefinition } from "../types";

export function hasCompletedAllActivities(
  completedActivityIds: readonly string[],
  catalogIds: readonly string[],
) {
  const completed = new Set(completedActivityIds);
  return catalogIds.length > 0 && catalogIds.every((id) => completed.has(id));
}

export function hasCompletedWorld(
  completedActivityIds: readonly string[],
  world: Pick<WorldDefinition, "activityIds">,
): boolean {
  return hasCompletedAllActivities(completedActivityIds, world.activityIds);
}

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
    ? hasCompletedWorld(completedIds, prerequisite)
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