import {
  ActivityDefinition,
  ActivityEngineType,
  ActivityItem,
  WorldDefinition,
} from "../types";

const engineTypes: readonly ActivityEngineType[] = [
  "tap-and-find",
  "drag-to-target",
  "count-and-select",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getItemIds(activityId: string, items: ActivityItem[]) {
  if (items.length === 0) {
    throw new Error(`Activity "${activityId}" must define at least one item.`);
  }
  const itemIds = new Set<string>();
  for (const item of items) {
    if (!item.id || itemIds.has(item.id)) {
      throw new Error(`Activity "${activityId}" contains duplicate item IDs.`);
    }
    itemIds.add(item.id);
  }
  return itemIds;
}

function validateEngineConfig(activity: ActivityDefinition) {
  if (activity.engineType === "tap-and-find") {
    const itemIds = getItemIds(activity.id, activity.config.items);
    if (!itemIds.has(activity.config.targetId)) {
      throw new Error(
        `Activity "${activity.id}" targetId "${activity.config.targetId}" does not reference an item.`,
      );
    }
    return;
  }

  if (activity.engineType === "drag-to-target") {
    const itemIds = getItemIds(activity.id, activity.config.items);
    if (activity.config.pairs.length === 0) {
      throw new Error(`Activity "${activity.id}" must define at least one drag pair.`);
    }
    if (activity.config.pairs.length > 3) {
      throw new Error(
        `Activity "${activity.id}" supports at most three visible drag pairs.`,
      );
    }
    const draggableIds = new Set<string>();
    const targetIds = new Set<string>();
    for (const pair of activity.config.pairs) {
      if (
        !itemIds.has(pair.draggableItemId) ||
        !itemIds.has(pair.targetId) ||
        pair.draggableItemId === pair.targetId
      ) {
        throw new Error(
          `Activity "${activity.id}" drag pair must reference different existing items.`,
        );
      }
      if (
        draggableIds.has(pair.draggableItemId) ||
        targetIds.has(pair.targetId)
      ) {
        throw new Error(`Activity "${activity.id}" contains duplicate drag pairs.`);
      }
      draggableIds.add(pair.draggableItemId);
      targetIds.add(pair.targetId);
    }
    return;
  }

  const { displayCount, options, targetCount, itemEmoji, itemLabel } =
    activity.config;
  if (
    !Number.isInteger(displayCount) ||
    displayCount < 1 ||
    !Number.isInteger(targetCount) ||
    !itemEmoji.trim() ||
    !itemLabel.trim() ||
    options.length < 2 ||
    new Set(options).size !== options.length ||
    options.some((option) => !Number.isInteger(option) || option < 0) ||
    !options.includes(targetCount) ||
    targetCount !== displayCount
  ) {
    throw new Error(
      `Activity "${activity.id}" has invalid count-and-select configuration.`,
    );
  }
}

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
      !activity.instructionAudio?.trim() ||
      !activity.audioLabel.trim() ||
      !activity.learningGoal.trim() ||
      !activity.successFeedback.trim() ||
      !activity.retryFeedback.trim() ||
      !activity.hint.trim()
    ) {
      throw new Error(`Activity "${activity.id}" is missing required content.`);
    }
    validateEngineConfig(activity);
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