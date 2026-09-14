import React from "react";
import {
  CountAndSelectEngine,
  DragToTargetEngine,
  OrderingEngine,
  TapAndFindEngine,
} from "../components/engines";
import {
  ActivityDefinition,
  ActivityEngineType,
  ActivityInteraction,
} from "../types";
import {
  ActivityByEngine,
  ActivityEngineValidator,
  activityEngineValidators,
} from "./activityEngineDefinitions";

export type ActivityEngineProps = {
  activity: ActivityDefinition;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export type ActivityEngineComponent = React.ComponentType<ActivityEngineProps>;

type TypedEngineComponent<K extends ActivityEngineType> = React.ComponentType<{
  activity: ActivityByEngine[K];
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
}>;

export type ActivityEngineRegistration<K extends ActivityEngineType> = {
  engineType: K;
  component: TypedEngineComponent<K>;
  render: ActivityEngineComponent;
  validate: ActivityEngineValidator<K>;
};

function defineActivityEngine<K extends ActivityEngineType>(
  engineType: K,
  component: TypedEngineComponent<K>,
  validate: ActivityEngineValidator<K>,
): ActivityEngineRegistration<K> {
  const render: ActivityEngineComponent = ({
    activity,
    onInteraction,
    disabled,
  }) => {
    if (activity.engineType !== engineType) {
      throw new Error(
        `Engine "${engineType}" cannot render activity "${activity.id}" with engine "${activity.engineType}".`,
      );
    }
    return React.createElement(component, {
      activity: activity as ActivityByEngine[K],
      onInteraction,
      disabled,
    });
  };
  return { engineType, component, render, validate };
}

export const activityEngineRegistry = {
  "tap-and-find": defineActivityEngine(
    "tap-and-find",
    TapAndFindEngine,
    activityEngineValidators["tap-and-find"],
  ),
  "drag-to-target": defineActivityEngine(
    "drag-to-target",
    DragToTargetEngine,
    activityEngineValidators["drag-to-target"],
  ),
  "count-and-select": defineActivityEngine(
    "count-and-select",
    CountAndSelectEngine,
    activityEngineValidators["count-and-select"],
  ),
  ordering: defineActivityEngine(
    "ordering",
    OrderingEngine,
    activityEngineValidators.ordering,
  ),
} satisfies {
  [K in ActivityEngineType]: ActivityEngineRegistration<K>;
};

export function isRegisteredActivityEngine(
  engineType: unknown,
): engineType is ActivityEngineType {
  return (
    typeof engineType === "string" &&
    Object.prototype.hasOwnProperty.call(activityEngineRegistry, engineType)
  );
}

export function getActivityEngine(
  engineType: ActivityEngineType | string,
): ActivityEngineComponent {
  if (!isRegisteredActivityEngine(engineType)) {
    throw new Error(`Activity engine "${engineType}" is not registered.`);
  }
  return activityEngineRegistry[engineType].render;
}