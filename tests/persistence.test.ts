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
import { activities } from "../src/data/activities";

const profileDefaults: ChildProfile = {
  name: "",
  avatar: "🌻",
  hasOnboarded: false,
};
const progressDefaults: ProgressState = {
  completedActivityIds: [],
  earnedRewardIds: [],
};
const catalog = activities.map((activity) => activity.id);

test("versioned state survives a save and reload cycle", () => {
  const saved = createEnvelope({
    completedActivityIds: ["find-bed"],
    earnedRewardIds: [],
  });
  assert.equal(saved.schemaVersion, STORAGE_SCHEMA_VERSION);
  assert.deepEqual(
    normalizeProgress(
      parseStoredJson(JSON.stringify(saved)),
      progressDefaults,
      catalog,
    ),
    { completedActivityIds: ["find-bed"], earnedRewardIds: [] },
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
      earnedRewardIds: [],
    }),
    progressDefaults,
    catalog,
  );

  assert.deepEqual(result.completedActivityIds, ["find-bed", "red-object"]);
});

test("an already completed activity is not duplicated", () => {
  const result = completeActivityProgress(
    { completedActivityIds: ["find-bed"], earnedRewardIds: [] },
    "find-bed",
    catalog,
  );
  assert.deepEqual(result.progress.completedActivityIds, ["find-bed"]);
  assert.equal(result.rewardGranted, false);
});

test("catalog reordering does not affect completion or reward", () => {
  const reordered = [...catalog].reverse();
  const finalId = reordered[reordered.length - 1];
  const result = completeActivityProgress(
    {
      completedActivityIds: reordered.slice(0, -1),
      earnedRewardIds: [],
    },
    finalId,
    reordered,
  );
  assert.deepEqual(result.progress.earnedRewardIds, ["lumi-flower"]);
  assert.equal(result.rewardGranted, true);
});

test("the first flower is granted only once", () => {
  const alreadyEarned = completeActivityProgress(
    {
      completedActivityIds: [...catalog],
      earnedRewardIds: ["lumi-flower"],
    },
    catalog[catalog.length - 1],
    catalog,
  );
  assert.deepEqual(alreadyEarned.progress.earnedRewardIds, ["lumi-flower"]);
  assert.equal(alreadyEarned.rewardGranted, false);
});

test("a reward granted at a non-final catalog position still opens the flower", () => {
  const missingId = "red-object";
  const result = completeActivityProgress(
    {
      completedActivityIds: catalog.filter((id) => id !== missingId),
      earnedRewardIds: [],
    },
    missingId,
    catalog,
  );

  assert.equal(result.rewardGranted, true);
  assert.equal(
    getCompletionDestination(result.rewardGranted, 1, catalog.length),
    "reward",
  );
});

test("schema v1 flower boolean migrates to the reward ID", () => {
  const legacy = {
    schemaVersion: 1,
    data: {
      completedActivityIds: [...catalog],
      earnedReward: true,
    },
  };
  assert.deepEqual(
    normalizeProgress(legacy, progressDefaults, catalog, ["lumi-flower"]),
    {
      completedActivityIds: catalog,
      earnedRewardIds: ["lumi-flower"],
    },
  );
});

test("completing one world preserves activity and reward IDs from other worlds", () => {
  const finalActivityId = catalog[catalog.length - 1];
  const result = completeActivityProgress(
    {
      completedActivityIds: ["other-world-activity", ...catalog.slice(0, -1)],
      earnedRewardIds: ["other-world-reward"],
    },
    finalActivityId,
    catalog,
  );
  assert.deepEqual(result.progress.completedActivityIds, [
    "other-world-activity",
    ...catalog,
  ]);
  assert.deepEqual(result.progress.earnedRewardIds, [
    "other-world-reward",
    "lumi-flower",
  ]);
});