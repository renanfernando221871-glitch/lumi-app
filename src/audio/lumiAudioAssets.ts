import { AudioSource } from "expo-audio";

export const LUMI_AUDIO_FILES = [
  "activity-01-find-bed.mp3",
  "activity-02-red-object.mp3",
  "activity-03-store-teddy.mp3",
  "activity-04-big-or-small.mp3",
  "activity-05-count-apples.mp3",
  "activity-06-identify-shape.mp3",
  "activity-07-lumi-emotion.mp3",
  "activity-08-tidy-house.mp3",
  "reward-you-did-it.mp3",
] as const;

export type LumiAudioFile = (typeof LUMI_AUDIO_FILES)[number];

/**
 * Metro needs literal require() calls to bundle local assets.
 * Replace each undefined value after adding the matching MP3.
 */
const lumiAudioAssets: Partial<Record<LumiAudioFile, AudioSource>> = {
  // "activity-01-find-bed.mp3": require("../../assets/audio/lumi/activity-01-find-bed.mp3"),
  // "activity-02-red-object.mp3": require("../../assets/audio/lumi/activity-02-red-object.mp3"),
  // "activity-03-store-teddy.mp3": require("../../assets/audio/lumi/activity-03-store-teddy.mp3"),
  // "activity-04-big-or-small.mp3": require("../../assets/audio/lumi/activity-04-big-or-small.mp3"),
  // "activity-05-count-apples.mp3": require("../../assets/audio/lumi/activity-05-count-apples.mp3"),
  // "activity-06-identify-shape.mp3": require("../../assets/audio/lumi/activity-06-identify-shape.mp3"),
  // "activity-07-lumi-emotion.mp3": require("../../assets/audio/lumi/activity-07-lumi-emotion.mp3"),
  // "activity-08-tidy-house.mp3": require("../../assets/audio/lumi/activity-08-tidy-house.mp3"),
  // "reward-you-did-it.mp3": require("../../assets/audio/lumi/reward-you-did-it.mp3"),
};

export function getLumiAudioAsset(fileName?: string): AudioSource | undefined {
  if (!fileName || !LUMI_AUDIO_FILES.includes(fileName as LumiAudioFile)) {
    return undefined;
  }
  return lumiAudioAssets[fileName as LumiAudioFile];
}