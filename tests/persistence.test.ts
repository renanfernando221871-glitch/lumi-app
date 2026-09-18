import assert from "node:assert/strict";
import test from "node:test";
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
  earnedRewardIds: [],
};
const catalog = ["legacy-activity-a", "legacy-activity-b"];

test("versioned state survives a save and reload cycle", () => {
  const saved = createEnvelope({
    completedActivityIds: ["legacy-activity-a"],
    earnedRewardIds: [],
  });
  assert.equal(saved.schemaVersion, STORAGE_SCHEMA_VERSION);
  assert.deepEqual(
    normalizeProgress(
      parseStoredJson(JSON.stringify(saved)),
      progressDefaults,
      catalog,
    ),
    { completedActivityIds: ["legacy-activity-a"], earnedRewardIds: [] },
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
        "legacy-activity-a",
        "legacy-activity-a",
        "unknown",
        null,
        "legacy-activity-b",
      ],
      earnedRewardIds: [],
    }),
    progressDefaults,
    catalog,
  );

  assert.deepEqual(result.completedActivityIds, [
    "legacy-activity-a",
    "legacy-activity-b",
  ]);
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