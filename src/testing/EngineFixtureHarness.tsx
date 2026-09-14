import React, { useState } from "react";
import { Text } from "react-native";
import { ActivityScreen } from "../screens/ActivityScreen";
import { ActivityDefinition, ActivityResult } from "../types";
import { dragFixture, tapFixture } from "./activityFixtures";

export function getRequestedEngineFixture(): ActivityDefinition | null {
  if (process.env.NODE_ENV === "production" || typeof location === "undefined") {
    return null;
  }
  const fixture = new URLSearchParams(location.search).get("engineFixture");
  if (fixture === "tap") return tapFixture;
  if (fixture === "drag") return dragFixture;
  return null;
}

export function EngineFixtureHarness({
  activity,
}: {
  activity: ActivityDefinition;
}) {
  const [result, setResult] = useState<ActivityResult | null>(null);
  return (
    <>
      <ActivityScreen
        activity={activity}
        activityNumber={1}
        total={1}
        finalCompletionLabel="Concluir atividade"
        onBack={() => undefined}
        onComplete={(next) => setResult(next ?? null)}
      />
      {result ? <Text testID="fixture-result">fixture-complete:{result.activityId}</Text> : null}
    </>
  );
}