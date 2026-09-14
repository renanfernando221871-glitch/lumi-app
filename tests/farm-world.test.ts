import assert from "node:assert/strict";
import test from "node:test";
import { activities, farmActivities } from "../src/data/activities";
import { rewards } from "../src/data/rewards";
import {
  canOpenWorld,
  canStartWorldActivity,
  completeWorldProgress,
  isWorldUnlocked,
} from "../src/domain/progress";
import {
  validateActivityCatalog,
  validateWorldCatalog,
} from "../src/domain/catalog";
import {
  createOrderingState,
  resetOrderingState,
  selectOrderingItem,
} from "../src/engines/ordering";
import {
  createEnvelope,
  normalizeProgress,
  parseStoredJson,
} from "../src/storage/schema";
import { OrderingActivity, ProgressState } from "../src/types";
import { casaDoLumi, fazendaDasDescobertas, worldCatalog } from "../src/data/worlds";

const emptyProgress: ProgressState = {
  completedActivityIds: [],
  earnedRewardIds: [],
};

test("the catalog contains exactly four valid worlds and thirty-two activities", () => {
  assert.equal(worldCatalog.length, 4);
  assert.equal(activities.length, 32);
  assert.deepEqual(
    worldCatalog.map((world) => world.activityIds.length),
    [8, 8, 8, 8],
  );
  assert.equal(
    new Set(worldCatalog.flatMap((world) => world.activityIds)).size,
    32,
  );
  assert.equal(
    validateActivityCatalog(activities),
    true,
  );
  assert.equal(
    validateWorldCatalog(
      worldCatalog,
      activities,
      rewards.map((reward) => reward.id),
    ),
    true,
  );
});

test("Parque stays softly locked until Fazenda is complete", () => {
  const parque = worldCatalog.find((world) => world.id === "parque-das-cores");
  assert.ok(parque);
  assert.equal(isWorldUnlocked(parque, emptyProgress, worldCatalog), false);
  const casaAndFarmProgress = {
    ...emptyProgress,
    completedActivityIds: [
      ...casaDoLumi.activityIds,
      ...fazendaDasDescobertas.activityIds,
    ],
  };
  assert.equal(
    isWorldUnlocked(parque, casaAndFarmProgress, worldCatalog),
    true,
  );
});

test("the farm stays softly locked until Casa is complete", () => {
  assert.equal(isWorldUnlocked(fazendaDasDescobertas, emptyProgress, worldCatalog), false);
  assert.equal(canOpenWorld(fazendaDasDescobertas, emptyProgress, worldCatalog), false);
  const casaProgress = {
    ...emptyProgress,
    completedActivityIds: [...casaDoLumi.activityIds],
  };
  assert.equal(
    isWorldUnlocked(fazendaDasDescobertas, casaProgress, worldCatalog),
    true,
  );
  assert.equal(canOpenWorld(fazendaDasDescobertas, casaProgress, worldCatalog), true);
});

test("the world helper rejects opening or skipping farm activities", () => {
  const firstFarmId = fazendaDasDescobertas.activityIds[0];
  const secondFarmId = fazendaDasDescobertas.activityIds[1];
  assert.equal(
    canStartWorldActivity(
      fazendaDasDescobertas,
      firstFarmId,
      emptyProgress,
      worldCatalog,
    ),
    false,
  );
  const casaProgress = {
    ...emptyProgress,
    completedActivityIds: [...casaDoLumi.activityIds],
  };
  assert.equal(
    canStartWorldActivity(
      fazendaDasDescobertas,
      secondFarmId,
      casaProgress,
      worldCatalog,
    ),
    false,
  );
  assert.equal(
    canStartWorldActivity(
      fazendaDasDescobertas,
      firstFarmId,
      casaProgress,
      worldCatalog,
    ),
    true,
  );
});

test("ordering validates correct, incorrect, reset, and alternate data-only configurations", () => {
  const activity = farmActivities.find(
    (candidate) => candidate.id === "farm-order-size",
  );
  assert.ok(activity);
  assert.equal(activity.engineType, "ordering");
  if (activity.engineType !== "ordering") return;

  let state = createOrderingState();
  const order = activity.config.correctOrder;
  state = selectOrderingItem(state, order[0], order).state;
  state = selectOrderingItem(state, order[1], order).state;
  const completed = selectOrderingItem(state, order[2], order);
  assert.equal(completed.completed, true);
  assert.equal(completed.state.completed, true);

  const wrong = selectOrderingItem(createOrderingState(), order[1], order);
  assert.equal(wrong.incorrect, true);
  assert.deepEqual(wrong.state.selectedItemIds, []);
  assert.deepEqual(resetOrderingState(), { selectedItemIds: [], completed: false });

  const alternate: OrderingActivity = {
    ...activity,
    id: "alternate-order",
    config: {
      orderingInstruction: "Coloque as frutas da maior para a menor.",
      correctOrder: ["watermelon", "apple", "berry"],
      items: [
        { id: "berry", label: "uva", emoji: "🫐", color: "#D8ECFC" },
        { id: "watermelon", label: "melancia", emoji: "🍉", color: "#DDF1D5" },
        { id: "apple", label: "maçã", emoji: "🍎", color: "#F7A49B" },
      ],
    },
  };
  assert.equal(validateActivityCatalog([alternate]), true);
  assert.equal(
    selectOrderingItem(
      selectOrderingItem(
        selectOrderingItem(createOrderingState(), "watermelon", alternate.config.correctOrder).state,
        "apple",
        alternate.config.correctOrder,
      ).state,
      "berry",
      alternate.config.correctOrder,
    ).completed,
    true,
  );
});

test("farm activities use the requested data-driven engine sequence and valid configs", () => {
  assert.deepEqual(
    farmActivities.map((activity) => activity.engineType),
    [
      "tap-and-find",
      "tap-and-find",
      "tap-and-find",
      "count-and-select",
      "ordering",
      "drag-to-target",
      "tap-and-find",
      "drag-to-target",
    ],
  );
  assert.equal(farmActivities.length, 8);
  assert.equal(validateActivityCatalog(farmActivities), true);
  assert.deepEqual(
    farmActivities[5].engineType === "drag-to-target"
      ? farmActivities[5].config.pairs
      : [],
    [
      { draggableItemId: "cow-source", targetId: "milk" },
      { draggableItemId: "chicken-source", targetId: "egg" },
      { draggableItemId: "sheep-source", targetId: "wool" },
    ],
  );
});

test("Parque activities use the requested data-driven engines and configs", () => {
  const parqueActivities = activities.filter(
    (activity) => activity.worldId === "parque-das-cores",
  );
  assert.deepEqual(
    parqueActivities.map((activity) => activity.engineType),
    [
      "tap-and-find",
      "tap-and-find",
      "tap-and-find",
      "count-and-select",
      "pattern-completion",
      "tap-and-find",
      "tap-and-find",
      "real-world-challenge",
    ],
  );
  assert.equal(parqueActivities.length, 8);
  assert.equal(validateActivityCatalog(parqueActivities), true);
  const count = parqueActivities[3];
  assert.equal(count.engineType, "count-and-select");
  if (count.engineType === "count-and-select") {
    assert.deepEqual(count.config.options, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }
});

test("old Casa-only schema-v2 progress remains valid after the farm is added", () => {
  const casaOnly = {
    completedActivityIds: ["find-bed", "red-object", "farm-who-moo"],
    earnedRewardIds: ["lumi-flower", "farm-basket"],
  };
  assert.deepEqual(
    normalizeProgress(
      parseStoredJson(JSON.stringify(createEnvelope(casaOnly))),
      emptyProgress,
      casaDoLumi.activityIds,
      ["lumi-flower"],
    ),
    {
      completedActivityIds: ["find-bed", "red-object"],
      earnedRewardIds: ["lumi-flower"],
    },
  );
});

test("farm progress persists through an envelope and reload normalization", () => {
  const saved: ProgressState = {
    completedActivityIds: [...casaDoLumi.activityIds, farmActivities[0].id],
    earnedRewardIds: ["lumi-flower"],
  };
  const reloaded = normalizeProgress(
    parseStoredJson(JSON.stringify(createEnvelope(saved))),
    emptyProgress,
    worldCatalog.flatMap((world) => world.activityIds),
    rewards.map((reward) => reward.id),
  );
  assert.deepEqual(reloaded, saved);
});

test("the farm reward is granted once and revisiting does not duplicate it", () => {
  const activityIds = fazendaDasDescobertas.activityIds;
  const beforeLast: ProgressState = {
    completedActivityIds: activityIds.slice(0, -1),
    earnedRewardIds: [],
  };
  const completed = completeWorldProgress(
    beforeLast,
    activityIds.at(-1)!,
    fazendaDasDescobertas,
  );
  assert.equal(completed.rewardGranted, true);
  assert.deepEqual(completed.progress.earnedRewardIds, ["farm-basket"]);

  const revisit = completeWorldProgress(
    completed.progress,
    activityIds[0],
    fazendaDasDescobertas,
  );
  assert.equal(revisit.rewardGranted, false);
  assert.deepEqual(revisit.progress.earnedRewardIds, ["farm-basket"]);
});