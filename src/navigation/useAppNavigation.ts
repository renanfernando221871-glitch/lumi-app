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
  };
}