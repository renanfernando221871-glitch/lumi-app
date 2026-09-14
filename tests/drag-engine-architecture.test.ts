import assert from "node:assert/strict";
import test from "node:test";
import { validateActivityCatalog } from "../src/domain/catalog";
import {
  createDragSession,
  completeDragPair,
  getDragPairKey,
  isDragSessionComplete,
  isDropInsideTarget,
  resetDragSession,
} from "../src/engines/dragSession";
import {
  isDefinedActivityEngine,
  validateActivityEngineDefinition,
} from "../src/engines/activityEngineDefinitions";
import {
  evaluateDragToTarget,
  getResponsiveDragFrames,
  getResponsiveDragStageHeight,
} from "../src/engines/interactions";
import { DragToTargetActivity } from "../src/types";

function makeDragActivity(
  id: string,
  pairCount: number,
): DragToTargetActivity {
  const pairs = Array.from({ length: pairCount }, (_, index) => ({
    draggableItemId: `object-${index}`,
    targetId: `target-${index}`,
  }));
  return {
    id,
    worldId: "test-world",
    engineType: "drag-to-target",
    title: `Drag ${pairCount}`,
    instructionText: "Coloque cada objeto no destino.",
    instructionAudio: `${id}.mp3`,
    audioLabel: "Ouvir instrução.",
    learningGoal: "Relacionar objetos e destinos.",
    difficulty: "easy",
    successFeedback: "Muito bem!",
    retryFeedback: "Tente novamente.",
    hint: "Observe os pares.",
    previewEmoji: "🔶",
    config: {
      dragInstruction: "Cada objeto no seu lugar",
      placedLabel: "Pronto!",
      pairs,
      items: pairs.flatMap((pair, index) => [
        {
          id: pair.draggableItemId,
          label: `objeto ${index}`,
          emoji: "🔷",
          color: "#D8ECFC",
        },
        {
          id: pair.targetId,
          label: `destino ${index}`,
          emoji: "🔶",
          color: "#FFF3D4",
        },
      ]),
    },
  };
}

test("drag-to-target completes an activity configured with one pair", () => {
  const activity = makeDragActivity("single-drag", 1);
  assert.equal(validateActivityCatalog([activity]), true);
  const pairKey = getDragPairKey(activity.config.pairs[0]);
  const session = completeDragPair(createDragSession(activity.id), pairKey);
  assert.equal(isDragSessionComplete(session, activity), true);
  assert.deepEqual(evaluateDragToTarget(activity, true), { completed: true });
});

test("drag-to-target supports multiple configured pairs without engine changes", () => {
  const activity = makeDragActivity("many-drag", 5);
  assert.equal(validateActivityCatalog([activity]), true);
  let session = createDragSession(activity.id);
  for (const pair of activity.config.pairs.slice(0, -1)) {
    session = completeDragPair(session, getDragPairKey(pair));
    assert.equal(isDragSessionComplete(session, activity), false);
  }
  session = completeDragPair(
    session,
    getDragPairKey(activity.config.pairs.at(-1)!),
  );
  assert.equal(isDragSessionComplete(session, activity), true);
  assert.ok(getResponsiveDragStageHeight(5) > getResponsiveDragStageHeight(3));
  const finalFrames = getResponsiveDragFrames(4, 5, 320);
  assert.ok(finalFrames.target.x + finalFrames.target.width <= 320);
});

test("consecutive drag activities do not share completed pair state", () => {
  const first = makeDragActivity("first-drag", 1);
  const second = makeDragActivity("second-drag", 2);
  const completedFirst = completeDragPair(
    createDragSession(first.id),
    getDragPairKey(first.config.pairs[0]),
  );
  assert.equal(isDragSessionComplete(completedFirst, first), true);

  const reset = resetDragSession(completedFirst, second.id);
  assert.equal(reset.activityId, second.id);
  assert.deepEqual(reset.completedPairKeys, []);
  assert.equal(isDragSessionComplete(reset, second), false);
});

test("an invalid drop returns feedback and can be followed by a valid drop", () => {
  const activity = makeDragActivity("retry-drag", 1);
  const frames = getResponsiveDragFrames(0, 1, 320);
  assert.equal(
    isDropInsideTarget(frames.draggable, frames.target, { dx: 0, dy: 0 }),
    false,
  );
  assert.deepEqual(evaluateDragToTarget(activity, false), {
    completed: false,
    feedback: activity.retryFeedback,
  });

  const sourceCenter = {
    x: frames.draggable.x + frames.draggable.width / 2,
    y: frames.draggable.y + frames.draggable.height / 2,
  };
  const targetCenter = {
    x: frames.target.x + frames.target.width / 2,
    y: frames.target.y + frames.target.height / 2,
  };
  assert.equal(
    isDropInsideTarget(frames.draggable, frames.target, {
      dx: targetCenter.x - sourceCenter.x,
      dy: targetCenter.y - sourceCenter.y,
    }),
    true,
  );
  assert.deepEqual(evaluateDragToTarget(activity, true), { completed: true });
});

test("unknown engines are rejected instead of routed to another validator", () => {
  assert.equal(isDefinedActivityEngine("missing-engine"), false);
  const invalid = {
    ...makeDragActivity("unknown-engine", 1),
    engineType: "missing-engine",
  };
  assert.throws(
    () =>
      validateActivityEngineDefinition(
        invalid as unknown as DragToTargetActivity,
      ),
    /unsupported engine "missing-engine"/,
  );
});