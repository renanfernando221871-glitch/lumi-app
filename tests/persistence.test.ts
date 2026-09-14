import assert from "node:assert/strict";
import test from "node:test";
import {
  completeActivityProgress,
  getCompletionDestination,
} from "../src/domain/progress";
import {
  createEnvelope,
  normalizeProfile,
  normalizeProgress,
  parseStoredJson,
  STORAGE_SCHEMA_VERSION,
} from "../src/storage/schema";
import { ChildProfile, ProgressState } from "../src/types";

const profileDefaults: ChildProfile = {
  name: "",
  avatar: "🌻",
  hasOnboarded: false,
};
const progressDefaults: ProgressState = {
  completedActivityIds: [],
  earnedReward: false,
};
const catalog = ["find-bed", "red-object", "store-teddy"];

test("versioned state survives a save and reload cycle", () => {
  const saved = createEnvelope({
    completedActivityIds: ["find-bed"],
    earnedReward: false,
  });
  assert.equal(saved.schemaVersion, STORAGE_SCHEMA_VERSION);
  assert.deepEqual(
    normalizeProgress(
      parseStoredJson(JSON.stringify(saved)),
      progressDefaults,
      catalog,
    ),
    { completedActivityIds: ["find-bed"], earnedReward: false },
  );
});

test("corrupt JSON and invalid profile values fall back safely", () => {
  assert.deepEqual(
    normalizeProgress(parseStoredJson("{broken"), progressDefaults, catalog),
    progressDefaults,
  );
  assert.deepEqual(
    normalizeProfile(
      createEnvelope({ name: null, avatar: 42, hasOnboarded: "yes" }),
      profileDefaults,
    ),
    profileDefaults,
  );
});

test("progress normalizes duplicate, unknown and non-string IDs", () => {
  const result = normalizeProgress(
    createEnvelope({
      completedActivityIds: [
        "find-bed",
        "find-bed",
        "unknown",
        null,
        "red-object",
      ],
      earnedReward: false,
    }),
    progressDefaults,
    catalog,
  );

  assert.deepEqual(result.completedActivityIds, ["find-bed", "red-object"]);
});

test("an already completed activity is not duplicated", () => {
  const result = completeActivityProgress(
    { completedActivityIds: ["find-bed"], earnedReward: false },
    "find-bed",
    catalog,
  );
  assert.deepEqual(result.progress.completedActivityIds, ["find-bed"]);
  assert.equal(result.rewardGranted, false);
});

test("catalog reordering does not affect completion or reward", () => {
  const reordered = ["store-teddy", "find-bed", "red-object"];
  const result = completeActivityProgress(
    {
      completedActivityIds: ["find-bed", "red-object"],
      earnedReward: false,
    },
    "store-teddy",
    reordered,
  );
  assert.equal(result.progress.earnedReward, true);
  assert.equal(result.rewardGranted, true);
});

test("the first flower is granted only once", () => {
  const alreadyEarned = completeActivityProgress(
    {
      completedActivityIds: [...catalog],
      earnedReward: true,
    },
    "store-teddy",
    catalog,
  );
  assert.equal(alreadyEarned.progress.earnedReward, true);
  assert.equal(alreadyEarned.rewardGranted, false);
});

test("a reward granted at a non-final catalog position still opens the flower", () => {
  const result = completeActivityProgress(
    {
      completedActivityIds: ["find-bed", "store-teddy"],
      earnedReward: false,
    },
    "red-object",
    catalog,
  );

  assert.equal(result.rewardGranted, true);
  assert.equal(getCompletionDestination(result.rewardGranted, 1, 3), "reward");
});