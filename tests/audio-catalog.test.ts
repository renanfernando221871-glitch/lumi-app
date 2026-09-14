import assert from "node:assert/strict";
import test from "node:test";
import { LUMI_AUDIO_FILES } from "../src/audio/lumiAudioAssets";
import { activities } from "../src/data/activities";

const activityAudioFiles = [
  "activity-01-find-bed.mp3",
  "activity-02-red-object.mp3",
  "activity-03-store-teddy.mp3",
  "activity-04-big-or-small.mp3",
  "activity-05-count-apples.mp3",
  "activity-06-identify-shape.mp3",
  "activity-07-lumi-emotion.mp3",
  "activity-08-tidy-house.mp3",
];

test("Casa keeps all eight original instruction audio reservations", () => {
  assert.deepEqual(
    activities
      .filter((activity) => activity.worldId === "casa-do-lumi")
      .map((activity) => activity.instructionAudio),
    activityAudioFiles,
  );
});

test("the local manifest reserves every production activity and reward recording", () => {
  const productionAudioFiles = activities.map(
    (activity) => activity.instructionAudio,
  );
  assert.equal(productionAudioFiles.length, 32);
  assert.equal(new Set(productionAudioFiles).size, 32);
  for (const file of productionAudioFiles) {
    assert.ok(LUMI_AUDIO_FILES.includes(file as (typeof LUMI_AUDIO_FILES)[number]));
  }
  assert.ok(LUMI_AUDIO_FILES.includes("reward-you-did-it.mp3"));
});