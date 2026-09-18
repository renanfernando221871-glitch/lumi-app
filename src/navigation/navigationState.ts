export type StaticRoute =
  | "splash"
  | "welcome"
  | "guardian"
  | "personalize"
  | "safety"
  | "guardianHome"
  | "childIntro"
  | "map"
  | "farmDiscoveries"
  | "farmWhoMoo"
  | "farmFindHorse";

export type NavigationState =
  | { route: "splash" }
  | { route: "welcome" }
  | { route: "guardian" }
  | { route: "personalize" }
  | { route: "safety" }
  | { route: "guardianHome" }
  | { route: "childIntro" }
  | { route: "map" }
  | { route: "farmDiscoveries" }
  | { route: "farmWhoMoo" }
  | { route: "farmFindHorse" };

export type NavigationAction =
  | { type: "replace"; route: StaticRoute }
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
      if (state.route === "farmDiscoveries") {
        return { route: "map" };
      }
      if (state.route === "farmWhoMoo") {
        return { route: "farmDiscoveries" };
      }
      if (state.route === "farmFindHorse") {
        return { route: "farmDiscoveries" };
      }
      return state;
  }
}

export function canGoBack(state: NavigationState) {
  return (
    state.route === "personalize" ||
    state.route === "safety" ||
    state.route === "childIntro" ||
    state.route === "farmDiscoveries" ||
    state.route === "farmWhoMoo" ||
    state.route === "farmFindHorse" ||
    state.route === "guardian"
  );
}
