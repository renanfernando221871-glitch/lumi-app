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
  evaluateTapAndFind,
} from "../src/engines/interactions";
import {
  initialNavigationState,
  navigationReducer,
} from "../src/navigation/navigationState";

test("production activities use the exhaustive interaction engine contracts", () => {
  assert.deepEqual(
    activities.map((activity) => activity.engineType),
    ["tap-and-find", "tap-and-find", "drag-to-target"],
  );
  assert.equal(validateActivityCatalog(activities), true);
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
  assert.deepEqual(casaDoLumi.activityIds, activities.map((activity) => activity.id));

  assert.throws(
    () => validateActivityCatalog([tapFixture, { ...tapFixture }]),
    /duplicate activity ID/,
  );
  assert.throws(
    () =>
      validateActivityCatalog([
        ({
          ...dragFixture,
          config: { ...dragFixture.config, draggableItemId: "missing" },
        } as typeof dragFixture),
      ]),
    /draggableItemId/,
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