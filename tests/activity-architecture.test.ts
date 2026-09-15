import assert from "node:assert/strict";
import test from "node:test";
import { validateActivityCatalog, validateWorldCatalog } from "../src/domain/catalog";
import { activities } from "../src/data/activities";
import { casaDoLumi, worldCatalog } from "../src/data/worlds";
import { rewards } from "../src/data/rewards";
import { ActivityResult } from "../src/types";
import { dragFixture, tapFixture } from "./fixtures/activityFixtures";
import {
  evaluateDragToTarget,
  evaluateCountAndSelect,
  getResponsiveDragFrames,
  evaluateTapAndFind,
} from "../src/engines/interactions";
import {
  initialNavigationState,
  navigationReducer,
} from "../src/navigation/navigationState";

test("Conheça o quarto renders a supported plant visual and keeps bed correct", () => {
  const activity = activities.find(({ id }) => id === "find-bed");
  assert.ok(activity && activity.engineType === "tap-and-find");
  if (!activity || activity.engineType !== "tap-and-find") return;

  const plant = activity.config.items.find(({ id }) => id === "plant");
  assert.equal(plant?.label, "plantinha");
  assert.equal(plant?.itemVisual, "potted-plant");
  assert.equal(activity.config.targetId, "bed");
  assert.deepEqual(evaluateTapAndFind(activity, "bed"), { completed: true });
});

test("production activities use the exhaustive interaction engine contracts", () => {
  const casaActivityIds = casaDoLumi.activityIds;
  assert.deepEqual(
    casaActivityIds.map((id) => activities.find((activity) => activity.id === id)!.engineType),
    [
      "tap-and-find",
      "tap-and-find",
      "drag-to-target",
      "tap-and-find",
      "count-and-select",
      "tap-and-find",
      "tap-and-find",
      "drag-to-target",
    ],
  );
  assert.deepEqual(
    activities.map((activity) => activity.engineType),
    [
      "tap-and-find",
      "tap-and-find",
      "drag-to-target",
      "tap-and-find",
      "count-and-select",
      "tap-and-find",
      "tap-and-find",
      "drag-to-target",
      "tap-and-find",
      "tap-and-find",
      "tap-and-find",
      "count-and-select",
      "ordering",
      "drag-to-target",
      "tap-and-find",
      "drag-to-target",
      "tap-and-find",
      "tap-and-find",
      "tap-and-find",
      "count-and-select",
      "pattern-completion",
      "tap-and-find",
      "tap-and-find",
      "real-world-challenge",
      "tap-and-find",
      "count-and-select",
      "classification",
      "tap-and-find",
      "visual-memory",
      "tap-and-find",
      "tap-and-find",
      "drag-to-target",
      "drag-to-target",
      "tap-and-find",
      "drag-to-target",
      "tap-and-find",
      "tap-and-find",
      "tap-and-find",
      "ordering",
      "tap-and-find",
    ],
  );
  assert.equal(validateActivityCatalog(activities), true);
});

test("the new count engine works from production configuration alone", () => {
  const countActivity = activities.find(
    (activity) => activity.id === "count-apples",
  );
  assert.ok(countActivity);
  assert.equal(countActivity.engineType, "count-and-select");
  if (countActivity.engineType !== "count-and-select") return;
  assert.deepEqual(evaluateCountAndSelect(countActivity, 3), {
    completed: true,
  });
  assert.deepEqual(evaluateCountAndSelect(countActivity, 2), {
    completed: false,
    feedback: "Conte devagar: uma, duas, três.",
  });
});

test("drag pairs stay inside narrow mobile stages", () => {
  for (const width of [320, 360, 430]) {
    for (let index = 0; index < 3; index += 1) {
      const frames = getResponsiveDragFrames(index, 3, width);
      assert.ok(frames.draggable.x >= 0);
      assert.ok(frames.target.x >= 0);
      assert.ok(frames.draggable.x + frames.draggable.width <= width);
      assert.ok(frames.target.x + frames.target.width <= width);
    }
  }
});

test("activity contracts standardize completion results", () => {
  const result: ActivityResult = {
    activityId: tapFixture.id,
    completed: true,
    attempts: 2,
    startedAt: 100,
    completedAt: 200,
  };
  assert.deepEqual(Object.keys(result).sort(), [
    "activityId",
    "attempts",
    "completed",
    "completedAt",
    "startedAt",
  ]);
});

test("test-only activities extend both engines through data alone", () => {
  assert.equal(tapFixture.engineType, "tap-and-find");
  assert.equal(dragFixture.engineType, "drag-to-target");
  assert.equal(validateActivityCatalog([tapFixture, dragFixture]), true);
  if (tapFixture.engineType !== "tap-and-find") {
    throw new Error("invalid tap fixture");
  }
  if (dragFixture.engineType !== "drag-to-target") {
    throw new Error("invalid drag fixture");
  }
  assert.deepEqual(evaluateTapAndFind(tapFixture, "star"), {
    completed: true,
  });
  assert.deepEqual(evaluateTapAndFind(tapFixture, "moon"), {
    completed: false,
    feedback: "Tente outra vez.",
  });
  assert.deepEqual(evaluateDragToTarget(dragFixture, true), {
    completed: true,
  });
});

test("world catalog validation rejects duplicate IDs and invalid references", () => {
  assert.equal(
    validateWorldCatalog(
      worldCatalog,
      activities,
      rewards.map((reward) => reward.id),
    ),
    true,
  );
  assert.deepEqual(
    casaDoLumi.activityIds,
    activities
      .filter((activity) => activity.worldId === "casa-do-lumi")
      .map((activity) => activity.id),
  );

  assert.throws(
    () => validateActivityCatalog([tapFixture, { ...tapFixture }]),
    /duplicate activity ID/,
  );
  assert.throws(
    () =>
      validateActivityCatalog([
        ({
          ...dragFixture,
          config: {
            ...dragFixture.config,
            pairs: [{ draggableItemId: "missing", targetId: "chest" }],
          },
        } as typeof dragFixture),
      ]),
    /drag pair/,
  );
});

test("navigation stores world/activity IDs and preserves back behavior", () => {
  const world = navigationReducer(initialNavigationState, {
    type: "openWorld",
    worldId: "casa-do-lumi",
  });
  assert.deepEqual(world, { route: "house", worldId: "casa-do-lumi" });

  const activity = navigationReducer(world, {
    type: "startActivity",
    worldId: "casa-do-lumi",
    activityId: "find-bed",
  });
  assert.equal(activity.route, "activity");
  assert.equal(activity.activityId, "find-bed");
  assert.equal(navigationReducer(activity, { type: "back" }).route, "house");
  assert.equal(navigationReducer(world, { type: "back" }).route, "map");

  const reward = navigationReducer(activity, {
    type: "showReward",
    rewardId: "lumi-flower",
  });
  assert.equal(reward.route, "activity");
  assert.equal(reward.rewardId, "lumi-flower");
  assert.equal(navigationReducer(reward, { type: "back" }).route, "map");
});