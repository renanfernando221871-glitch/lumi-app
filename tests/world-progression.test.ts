import assert from "node:assert/strict";
import test from "node:test";
import {
  completeWorldProgress,
  getNextWorldActivityId,
  getWorldProgressionDestination,
} from "../src/domain/progress";
import {
  casaDoLumi,
  fazendaDasDescobertas,
} from "../src/data/worlds";

test("Casa advances from activity 1 to activity 2", () => {
  assert.deepEqual(
    getWorldProgressionDestination(
      casaDoLumi,
      casaDoLumi.activityIds[0],
      false,
    ),
    { type: "activity", activityId: casaDoLumi.activityIds[1] },
  );
});

test("Casa advances from activity 7 to activity 8", () => {
  assert.deepEqual(
    getWorldProgressionDestination(
      casaDoLumi,
      casaDoLumi.activityIds[6],
      false,
    ),
    { type: "activity", activityId: casaDoLumi.activityIds[7] },
  );
});

test("Casa finishes activity 8 with reward and then returns to the map", () => {
  assert.deepEqual(
    getWorldProgressionDestination(
      casaDoLumi,
      casaDoLumi.activityIds[7],
      true,
    ),
    { type: "reward", rewardId: casaDoLumi.rewardId },
  );
  assert.deepEqual(
    getWorldProgressionDestination(
      casaDoLumi,
      casaDoLumi.activityIds[7],
      false,
    ),
    { type: "map" },
  );
});

test("Fazenda advances from activity 1 to activity 2", () => {
  assert.deepEqual(
    getWorldProgressionDestination(
      fazendaDasDescobertas,
      fazendaDasDescobertas.activityIds[0],
      false,
    ),
    { type: "activity", activityId: fazendaDasDescobertas.activityIds[1] },
  );
});

test("Fazenda advances from activity 7 to activity 8", () => {
  assert.deepEqual(
    getWorldProgressionDestination(
      fazendaDasDescobertas,
      fazendaDasDescobertas.activityIds[6],
      false,
    ),
    { type: "activity", activityId: fazendaDasDescobertas.activityIds[7] },
  );
});

test("Fazenda finishes activity 8 with reward and then returns to the map", () => {
  assert.deepEqual(
    getWorldProgressionDestination(
      fazendaDasDescobertas,
      fazendaDasDescobertas.activityIds[7],
      true,
    ),
    { type: "reward", rewardId: fazendaDasDescobertas.rewardId },
  );
  assert.deepEqual(
    getWorldProgressionDestination(
      fazendaDasDescobertas,
      fazendaDasDescobertas.activityIds[7],
      false,
    ),
    { type: "map" },
  );
});

test("revisiting a completed activity still follows the world's ID order", () => {
  const revisitedActivityId = fazendaDasDescobertas.activityIds[0];
  assert.equal(
    getNextWorldActivityId(fazendaDasDescobertas, revisitedActivityId),
    fazendaDasDescobertas.activityIds[1],
  );
  assert.deepEqual(
    getWorldProgressionDestination(
      fazendaDasDescobertas,
      revisitedActivityId,
      false,
    ),
    {
      type: "activity",
      activityId: fazendaDasDescobertas.activityIds[1],
    },
  );
});

test("a persisted gap defers the reward until the last world activity", () => {
  const gapActivityId = casaDoLumi.activityIds[1];
  const progressWithGap = {
    completedActivityIds: casaDoLumi.activityIds.filter(
      (activityId) => activityId !== gapActivityId,
    ),
    earnedRewardIds: [],
  };

  const gapCompletion = completeWorldProgress(
    progressWithGap,
    gapActivityId,
    casaDoLumi,
  );
  assert.equal(gapCompletion.rewardGranted, false);
  assert.deepEqual(gapCompletion.progress.earnedRewardIds, []);
  assert.deepEqual(
    getWorldProgressionDestination(casaDoLumi, gapActivityId, false),
    { type: "activity", activityId: casaDoLumi.activityIds[2] },
  );

  const lastActivityId = casaDoLumi.activityIds.at(-1)!;
  const terminalCompletion = completeWorldProgress(
    gapCompletion.progress,
    lastActivityId,
    casaDoLumi,
  );
  assert.equal(terminalCompletion.rewardGranted, true);
  assert.deepEqual(
    getWorldProgressionDestination(
      casaDoLumi,
      lastActivityId,
      terminalCompletion.rewardGranted,
    ),
    { type: "reward", rewardId: casaDoLumi.rewardId },
  );
});