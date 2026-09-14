import { ActivityInteraction } from "../types";

export type ActivitySessionState = {
  activityId: string;
  complete: boolean;
  feedback: string;
  advancing: boolean;
};

export function createActivitySession(activityId: string): ActivitySessionState {
  return {
    activityId,
    complete: false,
    feedback: "",
    advancing: false,
  };
}

export function resetActivitySession(
  current: ActivitySessionState,
  activityId: string,
): ActivitySessionState {
  return current.activityId === activityId
    ? current
    : createActivitySession(activityId);
}

export function applyActivityInteraction(
  current: ActivitySessionState,
  interaction: ActivityInteraction,
  successFeedback: string,
): ActivitySessionState {
  if (current.complete) return current;
  return interaction.completed
    ? { ...current, complete: true, feedback: successFeedback }
    : { ...current, feedback: interaction.feedback || "" };
}

export function canAdvanceActivity(session: ActivitySessionState): boolean {
  return session.complete && !session.advancing;
}