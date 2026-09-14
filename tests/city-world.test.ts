import assert from "node:assert/strict";
import test from "node:test";
import { activities, cidadeActivities } from "../src/data/activities";
import {
  cidadeDasAventuras,
  mercadoDoLumi,
  worldCatalog,
} from "../src/data/worlds";
import {
  canStartWorldActivity,
  completeWorldActivityTransition,
  getNextIncompleteActivityId,
  isWorldUnlocked,
} from "../src/domain/progress";
import { normalizeProgress } from "../src/storage/schema";
import { validateActivityCatalog } from "../src/domain/catalog";
import { ProgressState } from "../src/types";

const empty: ProgressState = {
  completedActivityIds: [],
  earnedRewardIds: [],
};

test("Cidade keeps the requested ID order and reuses data-driven engines", () => {
  assert.deepEqual(cidadeDasAventuras.activityIds, [
    "cidade-who-drives",
    "cidade-car-sound",
    "cidade-where-to-go",
    "cidade-cross-safely",
    "cidade-who-is-sad",
    "cidade-help-friend",
    "cidade-build-sentence",
    "cidade-lumi-story",
  ]);
  assert.deepEqual(
    cidadeActivities.map(({ engineType }) => engineType),
    [
      "drag-to-target",
      "tap-and-find",
      "drag-to-target",
      "tap-and-find",
      "tap-and-find",
      "tap-and-find",
      "ordering",
      "ordering",
    ],
  );
  assert.equal(validateActivityCatalog(activities), true);
});

test("Cidade unlocks only after Mercado and cannot skip activities", () => {
  assert.equal(isWorldUnlocked(cidadeDasAventuras, empty, worldCatalog), false);
  const afterMarket: ProgressState = {
    completedActivityIds: [...mercadoDoLumi.activityIds],
    earnedRewardIds: [mercadoDoLumi.rewardId],
  };
  assert.equal(
    isWorldUnlocked(cidadeDasAventuras, afterMarket, worldCatalog),
    true,
  );
  assert.equal(
    canStartWorldActivity(
      cidadeDasAventuras,
      cidadeDasAventuras.activityIds[1],
      afterMarket,
      worldCatalog,
    ),
    false,
  );
  assert.equal(
    canStartWorldActivity(
      cidadeDasAventuras,
      cidadeDasAventuras.activityIds[0],
      afterMarket,
      worldCatalog,
    ),
    true,
  );
});

test("Cidade advances by IDs and saved progress resumes at the first pending activity", () => {
  const afterMarket: ProgressState = {
    completedActivityIds: [...mercadoDoLumi.activityIds],
    earnedRewardIds: [mercadoDoLumi.rewardId],
  };
  const first = completeWorldActivityTransition(
    afterMarket,
    cidadeDasAventuras,
    cidadeDasAventuras.activityIds[0],
  );
  assert.deepEqual(first.destination, {
    type: "activity",
    activityId: cidadeDasAventuras.activityIds[1],
  });
  const reloaded = normalizeProgress(
    first.progress,
    empty,
    activities.map(({ id }) => id),
    worldCatalog.map(({ rewardId }) => rewardId),
  );
  assert.equal(
    getNextIncompleteActivityId(
      cidadeDasAventuras,
      reloaded.completedActivityIds,
    ),
    cidadeDasAventuras.activityIds[1],
  );
});

test("Cidade grants its reward only after activity eight and revisits go to map", () => {
  const beforeLast: ProgressState = {
    completedActivityIds: [
      ...mercadoDoLumi.activityIds,
      ...cidadeDasAventuras.activityIds.slice(0, -1),
    ],
    earnedRewardIds: [mercadoDoLumi.rewardId],
  };
  const final = completeWorldActivityTransition(
    beforeLast,
    cidadeDasAventuras,
    cidadeDasAventuras.activityIds.at(-1)!,
  );
  assert.deepEqual(final.destination, {
    type: "reward",
    rewardId: cidadeDasAventuras.rewardId,
  });
  assert.equal(
    final.progress.earnedRewardIds.filter(
      (id) => id === cidadeDasAventuras.rewardId,
    ).length,
    1,
  );
  const revisit = completeWorldActivityTransition(
    final.progress,
    cidadeDasAventuras,
    cidadeDasAventuras.activityIds.at(-1)!,
  );
  assert.deepEqual(revisit.destination, { type: "map" });
  assert.equal(
    revisit.progress.earnedRewardIds.filter(
      (id) => id === cidadeDasAventuras.rewardId,
    ).length,
    1,
  );
});

test("sentence and story ordering are fully configured by data", () => {
  const sentence = cidadeActivities.find(
    ({ id }) => id === "cidade-build-sentence",
  );
  const story = cidadeActivities.find(
    ({ id }) => id === "cidade-lumi-story",
  );
  assert.ok(sentence && sentence.engineType === "ordering");
  assert.ok(story && story.engineType === "ordering");
  if (!sentence || sentence.engineType !== "ordering") return;
  if (!story || story.engineType !== "ordering") return;
  assert.deepEqual(sentence.config.correctOrder, [
    "sentence-boy",
    "sentence-rides",
    "sentence-bike",
  ]);
  assert.deepEqual(story.config.correctOrder, [
    "story-leaves",
    "story-meets",
    "story-helps",
    "story-home",
  ]);
});

test("Quem dirige keeps vehicles in targets and professionals in draggable cards", () => {
  const activity = cidadeActivities.find(
    ({ id }) => id === "cidade-who-drives",
  );
  assert.ok(activity && activity.engineType === "drag-to-target");
  if (!activity || activity.engineType !== "drag-to-target") return;

  const item = (id: string) =>
    activity.config.items.find((candidate) => candidate.id === id)!;
  const driver = item("city-driver");
  const pilot = item("city-pilot");
  const trainDriver = item("city-train-driver");

  assert.equal(driver.emoji, "motorista");
  assert.equal(driver.characterVisual, "driver");
  assert.equal(driver.headwearEmoji, undefined);
  assert.equal(pilot.emoji, "👩‍✈️");
  assert.equal(trainDriver.emoji, "🧑");
  assert.equal(trainDriver.headwearEmoji, "🧢");

  for (const professional of [driver, trainDriver]) {
    assert.doesNotMatch(professional.emoji, /🚌|✈️|🚆|🔧/u);
  }
  assert.deepEqual(
    activity.config.pairs.map(({ targetId }) => item(targetId).emoji),
    ["🚌", "✈️", "🚆"],
  );
});