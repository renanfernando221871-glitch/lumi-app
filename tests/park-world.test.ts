import assert from "node:assert/strict";
import test from "node:test";
import { parqueActivities } from "../src/data/activities";
import { rewards } from "../src/data/rewards";
import {
  casaDoLumi,
  fazendaDasDescobertas,
  parqueDasCores,
  worldCatalog,
} from "../src/data/worlds";
import {
  canStartWorldActivity,
  completeWorldActivityTransition,
  completeWorldProgress,
  getNextIncompleteActivityId,
  getWorldProgressionDestination,
  isWorldUnlocked,
  normalizeWorldCompletedActivityIds,
} from "../src/domain/progress";
import { persistProgressBeforeCommit } from "../src/domain/progressPersistence";
import { validateActivityCatalog } from "../src/domain/catalog";
import {
  createPatternCompletionState,
  evaluatePatternCompletion,
  resetPatternCompletionState,
  selectPatternOption,
} from "../src/engines/patternCompletion";
import {
  createRealWorldChallengeState,
  evaluateRealWorldChallenge,
  resetRealWorldChallengeState,
} from "../src/engines/realWorldChallenge";
import {
  createEnvelope,
  normalizeProgress,
  parseStoredJson,
} from "../src/storage/schema";
import {
  PatternCompletionActivity,
  ProgressState,
  RealWorldChallengeActivity,
} from "../src/types";

const completedPreviousWorlds = [
  ...casaDoLumi.activityIds,
  ...fazendaDasDescobertas.activityIds,
];

test("Parque keeps the exact requested activity ID order", () => {
  assert.deepEqual(parqueDasCores.activityIds, [
    "parque-kites",
    "parque-shapes",
    "parque-above-below",
    "parque-count-ducks",
    "parque-sequence",
    "parque-right-path",
    "parque-speed",
    "parque-real-world",
  ]);
});

test("Parque entry starts at its first incomplete activity only", () => {
  const [kites, shapes, aboveBelow, ducks] = parqueDasCores.activityIds;
  assert.equal(getNextIncompleteActivityId(parqueDasCores, []), kites);
  assert.equal(
    getNextIncompleteActivityId(parqueDasCores, [kites]),
    shapes,
  );
  assert.equal(
    getNextIncompleteActivityId(parqueDasCores, [
      kites,
      shapes,
      aboveBelow,
    ]),
    ducks,
  );
});

test("Parque entry ignores progress from other worlds and removed IDs", () => {
  const mixedProgress = [
    ...casaDoLumi.activityIds,
    ...fazendaDasDescobertas.activityIds,
    "legacy-removed-activity",
    parqueDasCores.activityIds[0],
  ];
  assert.deepEqual(
    normalizeWorldCompletedActivityIds(parqueDasCores, mixedProgress),
    [parqueDasCores.activityIds[0]],
  );
  assert.equal(
    getNextIncompleteActivityId(parqueDasCores, mixedProgress),
    parqueDasCores.activityIds[1],
  );
});

test("Parque unlocks only after Casa and cannot skip activities", () => {
  assert.equal(
    isWorldUnlocked(
      parqueDasCores,
      { completedActivityIds: fazendaDasDescobertas.activityIds, earnedRewardIds: [] },
      worldCatalog,
    ),
    false,
  );
  const unlockedProgress: ProgressState = {
    completedActivityIds: completedPreviousWorlds,
    earnedRewardIds: ["lumi-flower", "farm-basket"],
  };
  assert.equal(
    isWorldUnlocked(parqueDasCores, unlockedProgress, worldCatalog),
    true,
  );
  assert.equal(
    canStartWorldActivity(
      parqueDasCores,
      parqueDasCores.activityIds[1],
      unlockedProgress,
      worldCatalog,
    ),
    false,
  );
  assert.equal(
    canStartWorldActivity(
      parqueDasCores,
      parqueDasCores.activityIds[0],
      unlockedProgress,
      worldCatalog,
    ),
    true,
  );
});

test("Parque advances 1→2, 7→8, and 8→reward→map", () => {
  assert.deepEqual(
    getWorldProgressionDestination(
      parqueDasCores,
      parqueDasCores.activityIds[3],
      false,
    ),
    { type: "activity", activityId: parqueDasCores.activityIds[4] },
  );
  assert.deepEqual(
    getWorldProgressionDestination(
      parqueDasCores,
      parqueDasCores.activityIds[0],
      false,
    ),
    { type: "activity", activityId: parqueDasCores.activityIds[1] },
  );
  assert.deepEqual(
    getWorldProgressionDestination(
      parqueDasCores,
      parqueDasCores.activityIds[6],
      false,
    ),
    { type: "activity", activityId: parqueDasCores.activityIds[7] },
  );
  assert.deepEqual(
    getWorldProgressionDestination(
      parqueDasCores,
      parqueDasCores.activityIds[7],
      true,
    ),
    { type: "reward", rewardId: parqueDasCores.rewardId },
  );
  assert.deepEqual(
    getWorldProgressionDestination(
      parqueDasCores,
      parqueDasCores.activityIds[7],
      false,
    ),
    { type: "map" },
  );
});

test("Parque completion transaction never reopens the same activity", () => {
  const firstActivityId = parqueDasCores.activityIds[0];
  const transition = completeWorldActivityTransition(
    {
      completedActivityIds: completedPreviousWorlds,
      earnedRewardIds: ["lumi-flower", "farm-basket"],
    },
    parqueDasCores,
    firstActivityId,
  );
  assert.equal(
    transition.progress.completedActivityIds.includes(firstActivityId),
    true,
  );
  assert.deepEqual(transition.destination, {
    type: "activity",
    activityId: parqueDasCores.activityIds[1],
  });
  assert.notEqual(
    transition.destination.type === "activity"
      ? transition.destination.activityId
      : undefined,
    firstActivityId,
  );
});

test("Parque completion transaction advances activity 4 to activity 5", () => {
  const completedThroughThird = {
    completedActivityIds: [
      ...completedPreviousWorlds,
      ...parqueDasCores.activityIds.slice(0, 3),
    ],
    earnedRewardIds: ["lumi-flower", "farm-basket"],
  };
  const transition = completeWorldActivityTransition(
    completedThroughThird,
    parqueDasCores,
    parqueDasCores.activityIds[3],
  );
  assert.deepEqual(transition.destination, {
    type: "activity",
    activityId: parqueDasCores.activityIds[4],
  });
});

test("saved Parque progress reenters at the first incomplete activity", () => {
  const savedProgress = {
    completedActivityIds: [
      ...completedPreviousWorlds,
      ...parqueDasCores.activityIds.slice(0, 4),
    ],
    earnedRewardIds: ["lumi-flower", "farm-basket"],
  };
  const reloaded = normalizeProgress(
    parseStoredJson(JSON.stringify(createEnvelope(savedProgress))),
    { completedActivityIds: [], earnedRewardIds: [] },
    worldCatalog.flatMap((world) => world.activityIds),
    rewards.map((reward) => reward.id),
  );
  assert.equal(
    getNextIncompleteActivityId(parqueDasCores, reloaded.completedActivityIds),
    parqueDasCores.activityIds[4],
  );
});

test("Parque final completion transaction shows reward and revisit goes to map", () => {
  const beforeLast = {
    completedActivityIds: [
      ...completedPreviousWorlds,
      ...parqueDasCores.activityIds.slice(0, -1),
    ],
    earnedRewardIds: ["lumi-flower", "farm-basket"],
  };
  const completed = completeWorldActivityTransition(
    beforeLast,
    parqueDasCores,
    parqueDasCores.activityIds.at(-1)!,
  );
  assert.deepEqual(completed.destination, {
    type: "reward",
    rewardId: parqueDasCores.rewardId,
  });
  const revisit = completeWorldActivityTransition(
    completed.progress,
    parqueDasCores,
    parqueDasCores.activityIds.at(-1)!,
  );
  assert.deepEqual(revisit.destination, { type: "map" });
});

test("Parque progress is persisted before it is committed for navigation", async () => {
  const events: string[] = [];
  let finishPersistence: (() => void) | undefined;
  const persistence = new Promise<void>((resolve) => {
    finishPersistence = resolve;
  });
  const nextProgress = {
    completedActivityIds: [
      ...completedPreviousWorlds,
      parqueDasCores.activityIds[0],
    ],
    earnedRewardIds: ["lumi-flower", "farm-basket"],
  };
  const operation = persistProgressBeforeCommit(
    nextProgress,
    async () => {
      await persistence;
      events.push("persisted");
    },
    () => events.push("committed"),
  );
  assert.deepEqual(events, []);
  finishPersistence?.();
  await operation;
  assert.deepEqual(events, ["persisted", "committed"]);
});

test("failed Parque persistence does not commit stale navigation state", async () => {
  let committed = false;
  await assert.rejects(
    persistProgressBeforeCommit(
      {
        completedActivityIds: [
          ...completedPreviousWorlds,
          parqueDasCores.activityIds[0],
        ],
        earnedRewardIds: ["lumi-flower", "farm-basket"],
      },
      async () => {
        throw new Error("storage unavailable");
      },
      () => {
        committed = true;
      },
    ),
    /storage unavailable/,
  );
  assert.equal(committed, false);
});

test("Parque progress persists and its terminal reward is granted once", () => {
  const beforeLast: ProgressState = {
    completedActivityIds: [
      ...completedPreviousWorlds,
      ...parqueDasCores.activityIds.slice(0, -1),
    ],
    earnedRewardIds: ["lumi-flower", "farm-basket"],
  };
  const completed = completeWorldProgress(
    beforeLast,
    parqueDasCores.activityIds.at(-1)!,
    parqueDasCores,
  );
  assert.equal(completed.rewardGranted, true);
  assert.deepEqual(completed.progress.earnedRewardIds, [
    "lumi-flower",
    "farm-basket",
    parqueDasCores.rewardId,
  ]);

  const reloaded = normalizeProgress(
    parseStoredJson(JSON.stringify(createEnvelope(completed.progress))),
    { completedActivityIds: [], earnedRewardIds: [] },
    worldCatalog.flatMap((world) => world.activityIds),
    rewards.map((reward) => reward.id),
  );
  assert.deepEqual(reloaded, completed.progress);

  const revisit = completeWorldProgress(
    reloaded,
    parqueDasCores.activityIds.at(-1)!,
    parqueDasCores,
  );
  assert.equal(revisit.rewardGranted, false);
  assert.deepEqual(revisit.progress.earnedRewardIds, completed.progress.earnedRewardIds);
});

test("pattern completion handles correct, incorrect, reset, and alternate data", () => {
  const activity = parqueActivities.find(
    (candidate) => candidate.id === "parque-sequence",
  );
  assert.ok(activity && activity.engineType === "pattern-completion");
  if (!activity || activity.engineType !== "pattern-completion") return;

  const initial = createPatternCompletionState();
  const wrong = selectPatternOption(initial, "blue", activity.config.targetOptionId);
  assert.equal(wrong.completed, false);
  assert.deepEqual(evaluatePatternCompletion(activity, "blue"), {
    completed: false,
    feedback: activity.retryFeedback,
  });
  const correct = selectPatternOption(initial, "red", activity.config.targetOptionId);
  assert.equal(correct.completed, true);
  assert.deepEqual(evaluatePatternCompletion(activity, "red"), {
    completed: true,
  });
  assert.deepEqual(resetPatternCompletionState(), { completed: false });

  const alternate: PatternCompletionActivity = {
    ...activity,
    id: "alternate-pattern",
    config: {
      sequence: [
        { id: "circle-a", label: "círculo", emoji: "●" },
        { id: "square-a", label: "quadrado", emoji: "■" },
        { id: "circle-b", label: "círculo", emoji: "●" },
        { id: "square-b", label: "quadrado", emoji: "■" },
      ],
      options: [
        { id: "circle", label: "círculo", emoji: "●" },
        { id: "triangle", label: "triângulo", emoji: "▲" },
      ],
      targetOptionId: "circle",
      placeholder: "?",
    },
  };
  assert.equal(validateActivityCatalog([alternate]), true);
  assert.deepEqual(evaluatePatternCompletion(alternate, "circle"), {
    completed: true,
  });
});

test("pattern completion rejects malformed configuration", () => {
  const activity = parqueActivities.find(
    (candidate) => candidate.id === "parque-sequence",
  );
  assert.ok(activity && activity.engineType === "pattern-completion");
  if (!activity || activity.engineType !== "pattern-completion") return;
  assert.throws(
    () =>
      validateActivityCatalog([
        {
          ...activity,
          config: { ...activity.config, targetOptionId: "missing" },
        },
      ]),
    /pattern-completion/,
  );
});

test("real-world challenge confirms locally and resets without permissions", () => {
  const activity = parqueActivities.find(
    (candidate) => candidate.id === "parque-real-world",
  );
  assert.ok(activity && activity.engineType === "real-world-challenge");
  if (!activity || activity.engineType !== "real-world-challenge") return;
  assert.deepEqual(createRealWorldChallengeState(), { confirmed: false });
  assert.deepEqual(resetRealWorldChallengeState(), { confirmed: false });
  assert.deepEqual(evaluateRealWorldChallenge(activity, true), {
    completed: true,
  });
  assert.deepEqual(evaluateRealWorldChallenge(activity, false), {
    completed: false,
    feedback: activity.retryFeedback,
  });

  const alternate: RealWorldChallengeActivity = {
    ...activity,
    id: "alternate-real-world",
    config: {
      prompt: "Mostre três dedos.",
      confirmationLabel: "Consegui!",
      visual: { emoji: "✋", label: "Três dedos" },
    },
  };
  assert.equal(validateActivityCatalog([alternate]), true);
  assert.deepEqual(evaluateRealWorldChallenge(alternate), { completed: true });
});