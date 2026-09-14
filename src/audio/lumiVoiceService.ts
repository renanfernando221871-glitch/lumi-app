import {
  AudioPlayer,
  AudioSource,
  createAudioPlayer,
} from "expo-audio";
import * as Speech from "expo-speech";
import {
  createLumiVoiceService,
  LumiVoiceService as SpeechFallbackService,
} from "./speechController";
import { getLumiAudioAsset } from "./lumiAudioAssets";
import {
  createVoiceController,
  LocalAudioDriver,
  VoiceService,
} from "./voiceController";

export type LumiVoiceService = {
  play: (request: { text: string; audioFile?: string }) => Promise<void>;
  stop: () => Promise<void>;
  dispose: () => Promise<void>;
};

function createLocalAudioDriver(player: AudioPlayer): LocalAudioDriver<AudioSource> {
  let playbackId = 0;
  let cancelCurrent: (() => void) | undefined;

  return {
    async stop() {
      playbackId += 1;
      cancelCurrent?.();
      cancelCurrent = undefined;
      player.pause();
      await player.seekTo(0);
    },
    async play(asset) {
      const id = ++playbackId;
      player.replace(asset);

      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const settle = (result: "complete" | "cancel" | Error) => {
          if (settled) return;
          settled = true;
          clearInterval(statusTimer);
          if (cancelCurrent === cancel) cancelCurrent = undefined;
          result instanceof Error ? reject(result) : resolve();
        };
        const cancel = () => settle("cancel");
        const statusTimer = setInterval(() => {
          const status = player.currentStatus;
          if (id !== playbackId) settle("cancel");
          else if (status.error) settle(new Error(status.error));
          else if (status.didJustFinish) settle("complete");
        }, 100);
        cancelCurrent = cancel;

        player.play();
      });
    },
  };
}

export function createSystemLumiVoiceService(
  onPlayingChange: (isPlaying: boolean) => void,
): LumiVoiceService {
  const player = createAudioPlayer(null, { downloadFirst: true });
  const speechFallback: SpeechFallbackService = createLumiVoiceService(
    {
      stop: Speech.stop,
      speak: Speech.speak,
      getAvailableVoices: Speech.getAvailableVoicesAsync,
    },
    onPlayingChange,
  );
  const controller: VoiceService<AudioSource> = createVoiceController(
    createLocalAudioDriver(player),
    speechFallback,
    onPlayingChange,
  );

  return {
    play: ({ text, audioFile }) =>
      controller.play({ text, audioAsset: getLumiAudioAsset(audioFile) }),
    stop: controller.stop,
    async dispose() {
      await controller.dispose();
      player.remove();
    },
  };
}