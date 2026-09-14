import assert from "node:assert/strict";
import test from "node:test";
import { activities } from "../src/data/activities";
import {
  applyActivityInteraction,
  canAdvanceActivity,
  createActivitySession,
} from "../src/domain/activitySession";
import {
  evaluateCountAndSelect,
  evaluateTapAndFind,
} from "../src/engines/interactions";
import { CountAndSelectActivity, TapAndFindActivity } from "../src/types";

const foundKiteActivity = activities.find(
  (activity) => activity.id === "parque-kites",
);
const foundDuckActivity = activities.find(
  (activity) => activity.id === "parque-count-ducks",
);

if (!foundKiteActivity || foundKiteActivity.engineType !== "tap-and-find") {
  throw new Error("Missing Parque kite activity.");
}
if (
  !foundDuckActivity ||
  foundDuckActivity.engineType !== "count-and-select"
) {
  throw new Error("Missing Parque duck activity.");
}
const kiteActivity: TapAndFindActivity = foundKiteActivity;
const duckActivity: CountAndSelectActivity = foundDuckActivity;

function kiteRound(targetId: string): TapAndFindActivity {
  const target = kiteActivity.config.items.find((item) => item.id === targetId);
  if (!target) throw new Error(`Unknown kite target ${targetId}`);
  return {
    ...kiteActivity,
    instructionText: `Qual é a ${target.label}?`,
    config: {
      ...kiteActivity.config,
      targetId,
      items: kiteActivity.config.items.map((item) => ({
        ...item,
        isTarget: item.id === targetId,
      })),
    },
  };
}

test("kite round renders three distinct configured colors with blue as sole target", () => {
  const round = kiteRound("blue-kite");
  const testedItems = round.config.items.filter((item) =>
    ["blue-kite", "yellow-kite", "red-kite"].includes(item.id),
  );
  assert.equal(new Set(testedItems.map((item) => item.color)).size, 3);
  assert.ok(testedItems.every((item) => item.colorGlyph === "◆"));
  assert.deepEqual(
    round.config.items.filter((item) => item.isTarget).map((item) => item.id),
    ["blue-kite"],
  );
  for (const item of testedItems) {
    assert.equal(
      evaluateTapAndFind(round, item.id).completed,
      item.id === "blue-kite",
    );
  }
});

test("kite target and question stay synchronized for yellow and red rounds", () => {
  for (const targetId of ["yellow-kite", "red-kite"]) {
    const round = kiteRound(targetId);
    const target = round.config.items.find((item) => item.id === targetId)!;
    assert.ok(round.instructionText.includes(target.label));
    assert.deepEqual(
      round.config.items.filter((item) => item.isTarget).map((item) => item.id),
      [targetId],
    );
    for (const item of round.config.items) {
      assert.equal(
        evaluateTapAndFind(round, item.id).completed,
        item.id === targetId,
      );
    }
  }
});

function duckRound(count: number): CountAndSelectActivity {
  return {
    ...duckActivity,
    id: `duck-round-${count}`,
    config: {
      ...duckActivity.config,
      displayCount: count,
      targetCount: count,
      options: Array.from({ length: 10 }, (_, index) => index + 1),
    },
  };
}

for (const count of [3, 7]) {
  test(`${count} ducklings complete only when ${count} is selected`, () => {
    const round = duckRound(count);
    assert.equal(round.config.displayCount, round.config.targetCount);
    assert.deepEqual(evaluateCountAndSelect(round, count), { completed: true });
    assert.deepEqual(evaluateCountAndSelect(round, String(count)), {
      completed: true,
    });
    assert.equal(evaluateCountAndSelect(round, count - 1).completed, false);
  });
}

test("wrong duck answer followed by correct answer releases advancement", () => {
  const round = duckRound(7);
  const initial = createActivitySession(round.id);
  const afterWrong = applyActivityInteraction(
    initial,
    evaluateCountAndSelect(round, 6),
    round.successFeedback,
  );
  assert.equal(afterWrong.complete, false);
  assert.equal(canAdvanceActivity(afterWrong), false);
  assert.equal(afterWrong.feedback, round.retryFeedback);

  const afterCorrect = applyActivityInteraction(
    afterWrong,
    evaluateCountAndSelect(round, "7"),
    round.successFeedback,
  );
  assert.equal(afterCorrect.complete, true);
  assert.equal(afterCorrect.feedback, round.successFeedback);
  assert.equal(canAdvanceActivity(afterCorrect), true);
});