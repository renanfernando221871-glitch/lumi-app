import React from "react";
import {
  DragToTargetEngine,
  TapAndFindEngine,
} from "../components/engines";
import {
  ActivityDefinition,
  ActivityEngineType,
  ActivityInteraction,
} from "../types";

export type ActivityEngineProps = {
  activity: ActivityDefinition;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export type ActivityEngineComponent = React.ComponentType<ActivityEngineProps>;

/*
 * This map intentionally has a Record type rather than a lookup with an
 * "unknown" component fallback. Adding an engine requires adding its entry
 * here and TypeScript will report the missing key.
 */
export const activityEngineRegistry: Record<
  ActivityEngineType,
  ActivityEngineComponent
> = {
  "tap-and-find": TapAndFindEngine as unknown as ActivityEngineComponent,
  "drag-to-target": DragToTargetEngine as unknown as ActivityEngineComponent,
};

export function getActivityEngine(
  engineType: ActivityEngineType,
): ActivityEngineComponent {
  return activityEngineRegistry[engineType];
}