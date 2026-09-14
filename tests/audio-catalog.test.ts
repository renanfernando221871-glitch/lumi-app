import assert from "node:assert/strict";
import test from "node:test";
import { LUMI_AUDIO_FILES } from "../src/audio/lumiAudioAssets";
import { activities } from "../src/data/activities";

test("activity data associates the three prepared instruction audio files", () => {
  assert.deepEqual(
    activities.map((activity) => activity.instructionAudio),
    [
      "activity-01-find-bed.mp3",
      "activity-02-red-object.mp3",
      "activity-03-store-teddy.mp3",
    ],
  );
});

test("the local manifest reserves all four requested Lumi recordings", () => {
  assert.deepEqual(LUMI_AUDIO_FILES, [
    "activity-01-find-bed.mp3",
    "activity-02-red-object.mp3",
    "activity-03-store-teddy.mp3",
    "reward-you-did-it.mp3",
  ]);
});