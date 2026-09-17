import assert from "node:assert/strict";
import test from "node:test";
import { getFarmActivityPreviewRequest } from "../src/navigation/developmentPreview";
import { isNonProgressingActivityMode } from "../src/navigation/activityLaunchPolicy";

test("farm activity preview accepts a development-only route", () => {
  assert.deepEqual(
    getFarmActivityPreviewRequest(
      "https://example.test/farm/activity/farm-who-moo?preview=true",
      true,
    ),
    { activityId: "farm-who-moo" },
  );
});

test("farm activity preview accepts a development-only query parameter", () => {
  assert.deepEqual(
    getFarmActivityPreviewRequest(
      "https://example.test/?farmActivity=farm-find-horse&preview=true",
      true,
    ),
    { activityId: "farm-find-horse" },
  );
});

test("farm activity preview is unavailable in production", () => {
  assert.equal(
    getFarmActivityPreviewRequest(
      "https://example.test/farm/activity/farm-who-moo?preview=true",
      false,
    ),
    undefined,
  );
});

test("farm activity preview safely rejects malformed URL encoding", () => {
  assert.equal(
    getFarmActivityPreviewRequest(
      "https://example.test/farm/activity/%E0%A4%A?preview=true",
      true,
    ),
    undefined,
  );
});

test("review never progresses and preview bypasses progress only in development", () => {
  assert.equal(isNonProgressingActivityMode("review", false), true);
  assert.equal(isNonProgressingActivityMode("review", true), true);
  assert.equal(isNonProgressingActivityMode("preview", true), true);
  assert.equal(isNonProgressingActivityMode("preview", false), false);
  assert.equal(isNonProgressingActivityMode(undefined, true), false);
});