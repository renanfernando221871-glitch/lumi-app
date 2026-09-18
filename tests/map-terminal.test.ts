import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { initialNavigationState, navigationReducer } from "../src/navigation/navigationState";

const appSource = readFileSync(resolve(process.cwd(), "App.tsx"), "utf8");

test("only the approved farm discoveries screen exists after the map", () => {
  assert.deepEqual(navigationReducer(initialNavigationState, {
    type: "replace",
    route: "farmDiscoveries",
  }), { route: "farmDiscoveries" });
  assert.deepEqual(navigationReducer({ route: "farmDiscoveries" }, {
    type: "back",
  }), { route: "map" });
  assert.doesNotMatch(appSource, /HouseScreen|ActivityScreen|RewardScreen/);
  assert.doesNotMatch(appSource, /startActivity|showReward/);
  assert.match(appSource, /worldId === "fazenda-das-descobertas"/);
  assert.match(appSource, /navigation\.replace\("farmDiscoveries"\)/);
  assert.match(appSource, /Novas aventuras em breve!/);
});