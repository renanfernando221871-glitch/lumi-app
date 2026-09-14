import assert from "node:assert/strict";
import test from "node:test";
import { activities, mercadoActivities } from "../src/data/activities";
import {
  mercadoDoLumi,
  parqueDasCores,
  worldCatalog,
} from "../src/data/worlds";
import {
  canStartWorldActivity,
  completeWorldActivityTransition,
  getNextIncompleteActivityId,
  isWorldUnlocked,
} from "../src/domain/progress";
import { normalizeProgress } from "../src/storage/schema";
import {
  classifyCurrentItem,
  createClassificationState,
} from "../src/engines/classification";
import { evaluateVisualMemory } from "../src/engines/visualMemory";
import { validateActivityCatalog } from "../src/domain/catalog";
import { ProgressState } from "../src/types";

const empty: ProgressState = {
  completedActivityIds: [],
  earnedRewardIds: [],
};

test("Mercado keeps the requested ID order and engine sequence", () => {
  assert.deepEqual(mercadoDoLumi.activityIds, [
    "mercado-find-apple",
    "mercado-two-bananas",
    "mercado-fruit-or-vegetable",
    "mercado-which-has-more",
    "mercado-what-disappeared",
    "mercado-what-color",
    "mercado-first-sound",
    "mercado-prepare-snack",
  ]);
  assert.deepEqual(
    mercadoActivities.map(({ engineType }) => engineType),
    [
      "tap-and-find",
      "count-and-select",
      "classification",
      "tap-and-find",
      "visual-memory",
      "tap-and-find",
      "tap-and-find",
      "drag-to-target",
    ],
  );
  assert.equal(validateActivityCatalog(activities), true);
});

test("Mercado unlocks only after Parque and cannot skip activities", () => {
  assert.equal(isWorldUnlocked(mercadoDoLumi, empty, worldCatalog), false);
  const afterPark: ProgressState = {
    completedActivityIds: [...parqueDasCores.activityIds],
    earnedRewardIds: [parqueDasCores.rewardId],
  };
  assert.equal(isWorldUnlocked(mercadoDoLumi, afterPark, worldCatalog), true);
  assert.equal(
    canStartWorldActivity(
      mercadoDoLumi,
      mercadoDoLumi.activityIds[1],
      afterPark,
      worldCatalog,
    ),
    false,
  );
  assert.equal(
    canStartWorldActivity(
      mercadoDoLumi,
      mercadoDoLumi.activityIds[0],
      afterPark,
      worldCatalog,
    ),
    true,
  );
});

test("Mercado advances by IDs, persists reentry and grants reward once", () => {
  const afterPark: ProgressState = {
    completedActivityIds: [...parqueDasCores.activityIds],
    earnedRewardIds: [parqueDasCores.rewardId],
  };
  const first = completeWorldActivityTransition(
    afterPark,
    mercadoDoLumi,
    mercadoDoLumi.activityIds[0],
  );
  assert.deepEqual(first.destination, {
    type: "activity",
    activityId: mercadoDoLumi.activityIds[1],
  });
  const reloaded = normalizeProgress({
    completedActivityIds: first.progress.completedActivityIds,
    earnedRewardIds: first.progress.earnedRewardIds,
  }, empty, activities.map(({ id }) => id), worldCatalog.map(({ rewardId }) => rewardId));
  assert.equal(
    getNextIncompleteActivityId(
      mercadoDoLumi,
      reloaded.completedActivityIds,
    ),
    mercadoDoLumi.activityIds[1],
  );

  const beforeLast: ProgressState = {
    completedActivityIds: [
      ...parqueDasCores.activityIds,
      ...mercadoDoLumi.activityIds.slice(0, -1),
    ],
    earnedRewardIds: [parqueDasCores.rewardId],
  };
  const final = completeWorldActivityTransition(
    beforeLast,
    mercadoDoLumi,
    mercadoDoLumi.activityIds.at(-1)!,
  );
  assert.deepEqual(final.destination, {
    type: "reward",
    rewardId: mercadoDoLumi.rewardId,
  });
  assert.equal(
    final.progress.earnedRewardIds.filter(
      (id) => id === mercadoDoLumi.rewardId,
    ).length,
    1,
  );
  const revisit = completeWorldActivityTransition(
    final.progress,
    mercadoDoLumi,
    mercadoDoLumi.activityIds.at(-1)!,
  );
  assert.deepEqual(revisit.destination, { type: "map" });
  assert.equal(
    revisit.progress.earnedRewardIds.filter(
      (id) => id === mercadoDoLumi.rewardId,
    ).length,
    1,
  );
});

test("classification works only from configured categories and assignments", () => {
  const activity = mercadoActivities.find(
    ({ id }) => id === "mercado-fruit-or-vegetable",
  );
  assert.ok(activity && activity.engineType === "classification");
  if (!activity || activity.engineType !== "classification") return;
  const initial = createClassificationState();
  assert.equal(classifyCurrentItem(activity, initial, "vegetable"), initial);
  let state = classifyCurrentItem(activity, initial, "fruit");
  state = classifyCurrentItem(activity, state, "vegetable");
  state = classifyCurrentItem(activity, state, "fruit");
  state = classifyCurrentItem(activity, state, "vegetable");
  assert.equal(state.complete, true);
});

test("visual memory evaluates the configured missing item", () => {
  const activity = mercadoActivities.find(
    ({ id }) => id === "mercado-what-disappeared",
  );
  assert.ok(activity && activity.engineType === "visual-memory");
  if (!activity || activity.engineType !== "visual-memory") return;
  assert.deepEqual(evaluateVisualMemory(activity, "memory-banana"), {
    completed: true,
  });
  assert.deepEqual(evaluateVisualMemory(activity, "memory-apple"), {
    completed: false,
    feedback: activity.retryFeedback,
  });
});