import {
  ActivityDefinition,
  ActivityEngineType,
  ActivityItem,
  CountAndSelectActivity,
  DragToTargetActivity,
  TapAndFindActivity,
} from "../types";

export type ActivityByEngine = {
  "tap-and-find": TapAndFindActivity;
  "drag-to-target": DragToTargetActivity;
  "count-and-select": CountAndSelectActivity;
};

export type ActivityEngineValidator<K extends ActivityEngineType> = (
  activity: ActivityByEngine[K],
) => void;

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

export const activityEngineValidators = {
  "tap-and-find": (activity) => {
    const itemIds = getItemIds(activity.id, activity.config.items);
    if (!itemIds.has(activity.config.targetId)) {
      throw new Error(
        `Activity "${activity.id}" targetId "${activity.config.targetId}" does not reference an item.`,
      );
    }
    if (
      Boolean(activity.config.featuredEmoji) !==
      Boolean(activity.config.featuredLabel)
    ) {
      throw new Error(
        `Activity "${activity.id}" must define featuredEmoji and featuredLabel together.`,
      );
    }
  },
  "drag-to-target": (activity) => {
    const itemIds = getItemIds(activity.id, activity.config.items);
    if (
      activity.config.pairs.length === 0 ||
      !activity.config.dragInstruction.trim() ||
      !activity.config.placedLabel.trim()
    ) {
      throw new Error(
        `Activity "${activity.id}" has incomplete drag-to-target configuration.`,
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
  },
  "count-and-select": (activity) => {
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
  },
} satisfies {
  [K in ActivityEngineType]: ActivityEngineValidator<K>;
};

export function isDefinedActivityEngine(
  engineType: unknown,
): engineType is ActivityEngineType {
  return (
    typeof engineType === "string" &&
    Object.prototype.hasOwnProperty.call(activityEngineValidators, engineType)
  );
}

export function validateActivityEngineDefinition(
  activity: ActivityDefinition,
): void {
  if (!isDefinedActivityEngine(activity.engineType)) {
    throw new Error(
      `Activity "${activity.id}" has unsupported engine "${String(
        activity.engineType,
      )}".`,
    );
  }
  const validator = activityEngineValidators[activity.engineType] as (
    candidate: ActivityDefinition,
  ) => void;
  validator(activity);
}