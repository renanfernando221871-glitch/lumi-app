import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { initialNavigationState, navigationReducer } from "../src/navigation/navigationState";

const appSource = readFileSync(resolve(process.cwd(), "App.tsx"), "utf8");

test("the application navigation ends at the world map", () => {
  assert.deepEqual(navigationReducer(initialNavigationState, {
    type: "replace",
    route: "map",
  }), { route: "map" });
  assert.doesNotMatch(appSource, /HouseScreen|ActivityScreen|RewardScreen/);
  assert.doesNotMatch(appSource, /startActivity|openWorld|showReward/);
  assert.match(appSource, /isRemovedFarmUrl \? "map" : "welcome"/);
  assert.match(appSource, /Novas aventuras em breve!/);
});