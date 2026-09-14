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
  "activity-09-farm-who-moo.mp3",
  "activity-10-farm-find-horse.mp3",
  "activity-11-farm-brown-animal.mp3",
  "activity-12-farm-count-chicks.mp3",
  "activity-13-farm-order-size.mp3",
  "activity-14-farm-where-from.mp3",
  "activity-15-farm-front-or-back.mp3",
  "activity-16-farm-help-harvest.mp3",
  "activity-17-parque-kites.mp3",
  "activity-18-parque-shapes.mp3",
  "activity-19-parque-above-below.mp3",
  "activity-20-parque-count-ducks.mp3",
  "activity-21-parque-sequence.mp3",
  "activity-22-parque-right-path.mp3",
  "activity-23-parque-speed.mp3",
  "activity-24-parque-real-world.mp3",
  "activity-25-mercado-find-apple.mp3",
  "activity-26-mercado-two-bananas.mp3",
  "activity-27-mercado-fruit-or-vegetable.mp3",
  "activity-28-mercado-which-has-more.mp3",
  "activity-29-mercado-what-disappeared.mp3",
  "activity-30-mercado-what-color.mp3",
  "activity-31-mercado-first-sound.mp3",
  "activity-32-mercado-prepare-snack.mp3",
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
  // "activity-09-farm-who-moo.mp3": require("../../assets/audio/lumi/activity-09-farm-who-moo.mp3"),
  // "activity-10-farm-find-horse.mp3": require("../../assets/audio/lumi/activity-10-farm-find-horse.mp3"),
  // "activity-11-farm-brown-animal.mp3": require("../../assets/audio/lumi/activity-11-farm-brown-animal.mp3"),
  // "activity-12-farm-count-chicks.mp3": require("../../assets/audio/lumi/activity-12-farm-count-chicks.mp3"),
  // "activity-13-farm-order-size.mp3": require("../../assets/audio/lumi/activity-13-farm-order-size.mp3"),
  // "activity-14-farm-where-from.mp3": require("../../assets/audio/lumi/activity-14-farm-where-from.mp3"),
  // "activity-15-farm-front-or-back.mp3": require("../../assets/audio/lumi/activity-15-farm-front-or-back.mp3"),
  // "activity-16-farm-help-harvest.mp3": require("../../assets/audio/lumi/activity-16-farm-help-harvest.mp3"),
  // "activity-17-parque-kites.mp3": require("../../assets/audio/lumi/activity-17-parque-kites.mp3"),
  // "activity-18-parque-shapes.mp3": require("../../assets/audio/lumi/activity-18-parque-shapes.mp3"),
  // "activity-19-parque-above-below.mp3": require("../../assets/audio/lumi/activity-19-parque-above-below.mp3"),
  // "activity-20-parque-count-ducks.mp3": require("../../assets/audio/lumi/activity-20-parque-count-ducks.mp3"),
  // "activity-21-parque-sequence.mp3": require("../../assets/audio/lumi/activity-21-parque-sequence.mp3"),
  // "activity-22-parque-right-path.mp3": require("../../assets/audio/lumi/activity-22-parque-right-path.mp3"),
  // "activity-23-parque-speed.mp3": require("../../assets/audio/lumi/activity-23-parque-speed.mp3"),
  // "activity-24-parque-real-world.mp3": require("../../assets/audio/lumi/activity-24-parque-real-world.mp3"),
  // "activity-25-mercado-find-apple.mp3": require("../../assets/audio/lumi/activity-25-mercado-find-apple.mp3"),
  // "activity-26-mercado-two-bananas.mp3": require("../../assets/audio/lumi/activity-26-mercado-two-bananas.mp3"),
  // "activity-27-mercado-fruit-or-vegetable.mp3": require("../../assets/audio/lumi/activity-27-mercado-fruit-or-vegetable.mp3"),
  // "activity-28-mercado-which-has-more.mp3": require("../../assets/audio/lumi/activity-28-mercado-which-has-more.mp3"),
  // "activity-29-mercado-what-disappeared.mp3": require("../../assets/audio/lumi/activity-29-mercado-what-disappeared.mp3"),
  // "activity-30-mercado-what-color.mp3": require("../../assets/audio/lumi/activity-30-mercado-what-color.mp3"),
  // "activity-31-mercado-first-sound.mp3": require("../../assets/audio/lumi/activity-31-mercado-first-sound.mp3"),
  // "activity-32-mercado-prepare-snack.mp3": require("../../assets/audio/lumi/activity-32-mercado-prepare-snack.mp3"),
  // "reward-you-did-it.mp3": require("../../assets/audio/lumi/reward-you-did-it.mp3"),
};

export function getLumiAudioAsset(fileName?: string): AudioSource | undefined {
  if (!fileName || !LUMI_AUDIO_FILES.includes(fileName as LumiAudioFile)) {
    return undefined;
  }
  return lumiAudioAssets[fileName as LumiAudioFile];
}