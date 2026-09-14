export type LocalAudioDriver<TAsset> = {
  stop: () => Promise<void>;
  play: (asset: TAsset) => Promise<void>;
};

export type FallbackVoiceDriver = {
  play: (text: string) => Promise<void>;
  stop: () => Promise<void>;
  dispose: () => void;
};

export type VoiceService<TAsset> = {
  play: (request: { text: string; audioAsset?: TAsset }) => Promise<void>;
  stop: () => Promise<void>;
  dispose: () => Promise<void>;
};

export function createVoiceController<TAsset>(
  localAudio: LocalAudioDriver<TAsset>,
  fallbackVoice: FallbackVoiceDriver,
  onPlayingChange: (isPlaying: boolean) => void,
): VoiceService<TAsset> {
  let requestId = 0;
  let active = true;
  let transition = Promise.resolve();

  const isCurrent = (id: number) => active && requestId === id;

  const stopAll = async () => {
    await Promise.allSettled([localAudio.stop(), fallbackVoice.stop()]);
  };

  const enqueue = (operation: () => Promise<void>) => {
    const result = transition.then(operation, operation);
    transition = result.catch(() => undefined);
    return result;
  };

  return {
    play({ text, audioAsset }) {
      const id = ++requestId;
      return enqueue(async () => {
        await stopAll();
        if (!isCurrent(id)) return;

        if (audioAsset) {
          onPlayingChange(true);
          void localAudio.play(audioAsset).then(
            () => {
              if (isCurrent(id)) onPlayingChange(false);
            },
            () => {
              if (!isCurrent(id)) return;
              onPlayingChange(false);
              void fallbackVoice.play(text);
            },
          );
          return;
        }

        await fallbackVoice.play(text);
      });
    },
    stop() {
      const id = ++requestId;
      return enqueue(async () => {
        await stopAll();
        if (active && requestId === id) onPlayingChange(false);
      });
    },
    dispose() {
      active = false;
      requestId += 1;
      return enqueue(async () => {
        await stopAll();
        fallbackVoice.dispose();
      });
    },
  };
}