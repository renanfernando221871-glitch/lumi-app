import { VisualMemoryActivity } from "../types";

export function evaluateVisualMemory(
  activity: VisualMemoryActivity,
  selectedItemId: string,
) {
  return {
    completed: selectedItemId === activity.config.missingItemId,
    ...(selectedItemId === activity.config.missingItemId
      ? {}
      : { feedback: activity.retryFeedback }),
  };
}