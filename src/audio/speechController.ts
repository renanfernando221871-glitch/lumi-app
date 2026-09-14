export type SpeechOptions = {
  language: string;
  rate: number;
  pitch: number;
  onDone: () => void;
  onStopped: () => void;
  onError: () => void;
};

export type SpeechDriver = {
  stop: () => Promise<void>;
  speak: (text: string, options: SpeechOptions) => void;
};

export type SpeechController = {
  play: (text: string) => Promise<void>;
  dispose: () => void;
};

export function createSpeechController(
  driver: SpeechDriver,
  onPlayingChange: (isPlaying: boolean) => void,
): SpeechController {
  let requestId = 0;
  let mounted = true;

  const finishIfCurrent = (id: number) => {
    if (mounted && requestId === id) {
      onPlayingChange(false);
    }
  };

  return {
    async play(text: string) {
      const id = ++requestId;
      onPlayingChange(true);

      try {
        await driver.stop();
        if (!mounted || requestId !== id) return;

        driver.speak(text, {
          language: "pt-BR",
          rate: 0.88,
          pitch: 1.08,
          onDone: () => finishIfCurrent(id),
          onStopped: () => finishIfCurrent(id),
          onError: () => finishIfCurrent(id),
        });
      } catch {
        finishIfCurrent(id);
      }
    },
    dispose() {
      mounted = false;
      requestId += 1;
      void driver.stop().catch(() => undefined);
    },
  };
}