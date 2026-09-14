import assert from "node:assert/strict";
import test from "node:test";
import {
  createActivitySession,
  resetActivitySession,
} from "../src/domain/activitySession";

test("a new activity always starts incomplete and without prior feedback", () => {
  const previous = {
    ...createActivitySession("find-bed"),
    complete: true,
    feedback: "Concluída!",
    advancing: true,
  };

  const next = resetActivitySession(previous, "red-object");

  assert.deepEqual(next, {
    activityId: "red-object",
    complete: false,
    feedback: "",
    advancing: false,
  });
});

test("rerendering the same activity preserves its current session", () => {
  const current = {
    ...createActivitySession("find-bed"),
    feedback: "Vamos tentar de novo.",
  };

  assert.equal(resetActivitySession(current, "find-bed"), current);
});