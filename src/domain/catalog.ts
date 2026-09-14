import {
  ActivityDefinition,
  ActivityEngineType,
  ActivityItem,
  WorldDefinition,
} from "../types";

const engineTypes: readonly ActivityEngineType[] = [
  "tap-and-find",
  "drag-to-target",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertItems(activity: ActivityDefinition) {
  if (activity.config.items.length === 0) {
    throw new Error(`Activity "${activity.id}" must define at least one item.`);
  }

  const itemIds = new Set<string>();
  for (const item of activity.config.items) {
    if (!item.id || itemIds.has(item.id)) {
      throw new Error(`Activity "${activity.id}" contains duplicate item IDs.`);
    }
    itemIds.add(item.id);
  }

  if (!itemIds.has(activity.config.targetId)) {
    throw new Error(
      `Activity "${activity.id}" targetId "${activity.config.targetId}" does not reference an item.`,
    );
  }
}

/**
 * Validates the data boundary in development and in catalog-focused tests.
 * Throwing here makes a malformed activity fail close to its source instead
 * of silently selecting a different interaction.
 */
export function validateActivityCatalog(
  catalog: readonly ActivityDefinition[],
): true {
  const activityIds = new Set<string>();

  for (const activity of catalog) {
    if (!isRecord(activity) || !activity.id || activityIds.has(activity.id)) {
      throw new Error("Activity catalog contains a missing or duplicate activity ID.");
    }
    activityIds.add(activity.id);

    if (!engineTypes.includes(activity.engineType)) {
      throw new Error(
        `Activity "${activity.id}" has unsupported engine "${String(
          activity.engineType,
        )}".`,
      );
    }

    if (
      !activity.worldId.trim() ||
      !activity.title.trim() ||
      !activity.instructionText.trim() ||
      !activity.audioLabel.trim() ||
      !activity.objective.trim() ||
      !activity.feedbackSuccess.trim() ||
      !activity.feedbackAttempt.trim() ||
      !activity.hint.trim()
    ) {
      throw new Error(`Activity "${activity.id}" is missing presentation copy.`);
    }

    assertItems(activity);

    if (
      activity.engineType === "drag-to-target" &&
      (!activity.config.draggableItemId ||
        activity.config.draggableItemId === activity.config.targetId ||
        !activity.config.items.some(
          (item) => item.id === activity.config.draggableItemId,
        ))
    ) {
      throw new Error(
        `Activity "${activity.id}" draggableItemId must reference a non-target item.`,
      );
    }
  }

  return true;
}

export function validateWorldCatalog(
  catalog: readonly WorldDefinition[],
  activities: readonly ActivityDefinition[],
  rewardIds: readonly string[] = ["lumi-flower"],
): true {
  const worldIds = new Set<string>();
  const activityIds = new Set<string>();
  for (const world of catalog) {
    if (!world.id || worldIds.has(world.id)) {
      throw new Error("World catalog contains a missing or duplicate world ID.");
    }
    worldIds.add(world.id);
    if (
      !world.title.trim() ||
      !world.description.trim() ||
      !world.rewardId.trim()
    ) {
      throw new Error(`World "${world.id}" has incomplete configuration.`);
    }
    if (world.activityIds.length === 0) {
      throw new Error(`World "${world.id}" must contain at least one activity.`);
    }
    if (!rewardIds.includes(world.rewardId)) {
      throw new Error(
        `World "${world.id}" references unknown reward "${world.rewardId}".`,
      );
    }
    for (const activityId of world.activityIds) {
      if (activityIds.has(activityId)) {
        throw new Error(`Activity catalog contains duplicate activity ID "${activityId}".`);
      }
      activityIds.add(activityId);
      const activity = activities.find((candidate) => candidate.id === activityId);
      if (!activity) {
        throw new Error(`World "${world.id}" references unknown activity "${activityId}".`);
      }
      if (activity.worldId !== world.id) {
        throw new Error(
          `Activity "${activity.id}" references unknown world "${activity.worldId}".`,
        );
      }
    }
  }
  for (const activity of activities) {
    if (!worldIds.has(activity.worldId)) {
      throw new Error(
        `Activity "${activity.id}" references unknown world "${activity.worldId}".`,
      );
    }
  }
  validateActivityCatalog(activities);
  return true;
}

export function isActivityItem(value: unknown): value is ActivityItem {
  return isRecord(value) && typeof value.id === "string";
}