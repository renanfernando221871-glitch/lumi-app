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