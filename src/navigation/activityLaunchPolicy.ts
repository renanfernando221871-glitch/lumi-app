import { ActivityLaunchMode } from "./navigationState";

export function isNonProgressingActivityMode(
  activityMode: ActivityLaunchMode | undefined,
  isDevelopment: boolean,
): boolean {
  return (
    activityMode === "review" ||
    (activityMode === "preview" && isDevelopment)
  );
}