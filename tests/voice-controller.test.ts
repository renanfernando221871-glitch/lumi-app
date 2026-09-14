import assert from "node:assert/strict";
import test from "node:test";
import {
  createVoiceController,
  FallbackVoiceDriver,
  LocalAudioDriver,
} from "../src/audio/voiceController";

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function setup() {
  const localPlays: string[] = [];
  const fallbackPlays: string[] = [];
  const states: boolean[] = [];
  const pendingLocal = deferred();
  const local: LocalAudioDriver<string> = {
    stop: async () => undefined,
    play: (asset) => {
      localPlays.push(asset);
      return pendingLocal.promise;
    },
  };
  const fallback: FallbackVoiceDriver = {
    stop: async () => undefined,
    play: async (text) => {
      fallbackPlays.push(text);
    },
    dispose: () => undefined,
  };
  const service = createVoiceController(local, fallback, (state) => states.push(state));

  return { service, localPlays, fallbackPlays, states, pendingLocal };
}

test("local audio is preferred over TTS and can finish normally", async () => {
  const { service, localPlays, fallbackPlays, states, pendingLocal } = setup();
  await service.play({ text: "Onde está a cama?", audioAsset: "bed.mp3" });
  assert.deepEqual(localPlays, ["bed.mp3"]);
  assert.deepEqual(fallbackPlays, []);
  assert.deepEqual(states, [true]);

  pendingLocal.resolve();
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(states, [true, false]);
});

test("missing local audio uses TTS fallback", async () => {
  const { service, localPlays, fallbackPlays } = setup();
  await service.play({ text: "Qual objeto é vermelho?" });

  assert.deepEqual(localPlays, []);
  assert.deepEqual(fallbackPlays, ["Qual objeto é vermelho?"]);
});

test("failed local audio falls back to TTS", async () => {
  const { service, fallbackPlays, pendingLocal } = setup();
  const play = service.play({
    text: "Vamos guardar o ursinho?",
    audioAsset: "teddy.mp3",
  });

  await play;
  pendingLocal.reject(new Error("missing asset"));
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(fallbackPlays, ["Vamos guardar o ursinho?"]);
});

test("replay and dispose stop active audio", async () => {
  let localStops = 0;
  let fallbackStops = 0;
  let disposed = false;
  const local: LocalAudioDriver<string> = {
    stop: async () => {
      localStops += 1;
    },
    play: async () => undefined,
  };
  const fallback: FallbackVoiceDriver = {
    stop: async () => {
      fallbackStops += 1;
    },
    play: async () => undefined,
    dispose: () => {
      disposed = true;
    },
  };
  const service = createVoiceController(local, fallback, () => undefined);

  await service.play({ text: "Muito bem! Você conseguiu!", audioAsset: "reward.mp3" });
  await service.play({ text: "Muito bem! Você conseguiu!", audioAsset: "reward.mp3" });
  await service.dispose();

  assert.equal(localStops, 3);
  assert.equal(fallbackStops, 3);
  assert.equal(disposed, true);
});

test("serializes rapid stop transitions before starting the latest audio", async () => {
  const firstStop = deferred();
  let stopCalls = 0;
  const starts: string[] = [];
  const local: LocalAudioDriver<string> = {
    stop: () => {
      stopCalls += 1;
      return stopCalls === 1 ? firstStop.promise : Promise.resolve();
    },
    play: async (asset) => {
      starts.push(asset);
    },
  };
  const fallback: FallbackVoiceDriver = {
    stop: async () => undefined,
    play: async () => undefined,
    dispose: () => undefined,
  };
  const service = createVoiceController(local, fallback, () => undefined);

  const first = service.play({ text: "primeira", audioAsset: "first.mp3" });
  const second = service.play({ text: "segunda", audioAsset: "second.mp3" });
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.deepEqual(starts, []);

  firstStop.resolve();
  await Promise.all([first, second]);
  assert.deepEqual(starts, ["second.mp3"]);
});