import { ActivityInteraction, PatternCompletionActivity } from "../types";

export type PatternCompletionState = {
  selectedOptionId?: string;
  completed: boolean;
};

export function createPatternCompletionState(): PatternCompletionState {
  return { completed: false };
}

export function resetPatternCompletionState(): PatternCompletionState {
  return createPatternCompletionState();
}

export function isPatternOptionCorrect(
  optionId: string,
  targetOptionId: string,
): boolean {
  return optionId === targetOptionId;
}

export function selectPatternOption(
  state: PatternCompletionState,
  optionId: string,
  targetOptionId: string,
): { state: PatternCompletionState; completed: boolean } {
  if (state.completed) return { state, completed: true };
  const completed = isPatternOptionCorrect(optionId, targetOptionId);
  return {
    state: { selectedOptionId: optionId, completed },
    completed,
  };
}

export function evaluatePatternCompletion(
  activity: PatternCompletionActivity,
  optionId: string,
): ActivityInteraction {
  return isPatternOptionCorrect(optionId, activity.config.targetOptionId)
    ? { completed: true }
    : { completed: false, feedback: activity.retryFeedback };
}