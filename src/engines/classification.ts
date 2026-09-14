import { ClassificationActivity } from "../types";

export type ClassificationState = {
  nextItemIndex: number;
  complete: boolean;
};

export function createClassificationState(): ClassificationState {
  return { nextItemIndex: 0, complete: false };
}

export function classifyCurrentItem(
  activity: ClassificationActivity,
  state: ClassificationState,
  categoryId: string,
): ClassificationState {
  if (state.complete) return state;
  const item = activity.config.items[state.nextItemIndex];
  const assignment = activity.config.assignments.find(
    ({ itemId }) => itemId === item?.id,
  );
  if (!item || assignment?.categoryId !== categoryId) return state;
  const nextItemIndex = state.nextItemIndex + 1;
  return {
    nextItemIndex,
    complete: nextItemIndex === activity.config.items.length,
  };
}