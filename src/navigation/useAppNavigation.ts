import { useCallback, useEffect, useReducer } from "react";
import { BackHandler } from "react-native";
import {
  StaticRoute,
  canGoBack,
  initialNavigationState,
  navigationReducer,
} from "./navigationState";

export function useAppNavigation() {
  const [state, dispatch] = useReducer(
    navigationReducer,
    initialNavigationState,
  );

  const replace = useCallback((route: StaticRoute) => {
    dispatch({ type: "replace", route });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: "back" });
  }, []);

  const openWorld = useCallback((worldId: string) => {
    dispatch({ type: "openWorld", worldId });
  }, []);

  const startActivity = useCallback((worldId: string, activityId: string) => {
    dispatch({ type: "startActivity", worldId, activityId });
  }, []);

  const showReward = useCallback((rewardId: string) => {
    dispatch({ type: "showReward", rewardId });
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      if (!canGoBack(state)) return false;
      dispatch({ type: "back" });
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );
    return () => subscription.remove();
  }, [state.route]);

  return {
    ...state,
    replace,
    goBack,
    openWorld,
    startActivity,
    showReward,
  };
}