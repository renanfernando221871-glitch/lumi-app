import { AudioSource } from "expo-audio";

export const LUMI_AUDIO_FILES = [
  "activity-01-find-bed.mp3",
  "activity-02-red-object.mp3",
  "activity-03-store-teddy.mp3",
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
  // "reward-you-did-it.mp3": require("../../assets/audio/lumi/reward-you-did-it.mp3"),
};

export function getLumiAudioAsset(fileName?: string): AudioSource | undefined {
  if (!fileName || !LUMI_AUDIO_FILES.includes(fileName as LumiAudioFile)) {
    return undefined;
  }
  return lumiAudioAssets[fileName as LumiAudioFile];
}