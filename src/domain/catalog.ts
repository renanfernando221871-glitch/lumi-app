import {
  ActivityDefinition,
  ActivityItem,
  WorldDefinition,
} from "../types";
import {
  isDefinedActivityEngine,
  validateActivityEngineDefinition,
} from "../engines/activityEngineDefinitions";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

    if (!isDefinedActivityEngine(activity.engineType)) {
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
      !activity.hint.trim() ||
      !activity.previewEmoji.trim()
    ) {
      throw new Error(`Activity "${activity.id}" is missing required content.`);
    }
    validateActivityEngineDefinition(activity);
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
    if (
      world.unlock.prerequisiteWorldId &&
      (world.unlock.prerequisiteWorldId === world.id ||
        !catalog.some(
          (candidate) => candidate.id === world.unlock.prerequisiteWorldId,
        ))
    ) {
      throw new Error(
        `World "${world.id}" references an unknown prerequisite world.`,
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