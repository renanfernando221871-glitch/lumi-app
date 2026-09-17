export type StaticRoute =
  | "splash"
  | "welcome"
  | "guardian"
  | "personalize"
  | "safety"
  | "guardianHome"
  | "childIntro"
  | "map";

export type ActivityLaunchMode = "review" | "preview";

export type NavigationState =
  | { route: "splash" }
  | { route: "welcome" }
  | { route: "guardian" }
  | { route: "personalize" }
  | { route: "safety" }
  | { route: "guardianHome" }
  | { route: "childIntro" }
  | { route: "map" }
  | { route: "house"; worldId: string }
  | {
      route: "activity";
      worldId: string;
      activityId: string;
      activityMode?: ActivityLaunchMode;
      rewardId?: string;
    };

export type NavigationAction =
  | { type: "replace"; route: StaticRoute }
  | { type: "openWorld"; worldId: string }
  | {
      type: "startActivity";
      worldId: string;
      activityId: string;
      activityMode?: ActivityLaunchMode;
    }
  | { type: "showReward"; rewardId: string }
  | { type: "back" };

export const initialNavigationState: NavigationState = {
  route: "splash",
};

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case "replace":
      return { route: action.route };
    case "openWorld":
      return { route: "house", worldId: action.worldId };
    case "startActivity":
      return {
        route: "activity",
        worldId: action.worldId,
        activityId: action.activityId,
        ...(action.activityMode ? { activityMode: action.activityMode } : {}),
      };
    case "showReward":
      if (state.route !== "activity") {
        throw new Error("A reward can only be shown over an activity.");
      }
      return { ...state, rewardId: action.rewardId };
    case "back":
      if (state.route === "guardian") {
        return { route: "welcome" };
      }
      if (state.route === "personalize") {
        return { route: "guardian" };
      }
      if (state.route === "safety") {
        return { route: "personalize" };
      }
      if (state.route === "childIntro") {
        return { route: "guardianHome" };
      }
      if (state.route === "house") {
        return { route: "map" };
      }
      if (state.route === "activity") {
        return state.rewardId
          ? { route: "map" }
          : { route: "house", worldId: state.worldId };
      }
      return state;
  }
}

export function canGoBack(state: NavigationState) {
  return (
    state.route === "personalize" ||
    state.route === "safety" ||
    state.route === "childIntro" ||
    state.route === "guardian" ||
    state.route === "house" ||
    state.route === "activity"
  );
}