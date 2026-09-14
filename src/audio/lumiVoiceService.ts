import * as Speech from "expo-speech";
import {
  createLumiVoiceService,
  LumiVoiceService,
} from "./speechController";

export type { LumiVoiceService };

export function createSystemLumiVoiceService(
  onPlayingChange: (isPlaying: boolean) => void,
): LumiVoiceService {
  return createLumiVoiceService(
    {
      stop: Speech.stop,
      speak: Speech.speak,
      getAvailableVoices: Speech.getAvailableVoicesAsync,
    },
    onPlayingChange,
  );
}