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

test("all eight activities declare their reserved local instruction audio", () => {
  assert.deepEqual(
    activities.map((activity) => activity.instructionAudio),
    activityAudioFiles,
  );
});

test("the local manifest reserves all activity and reward recordings", () => {
  assert.deepEqual(LUMI_AUDIO_FILES, [
    ...activityAudioFiles,
    "reward-you-did-it.mp3",
  ]);
});