import assert from "node:assert/strict";
import test from "node:test";
import {
  createLumiVoiceService,
  prepareLumiSpeechText,
  selectLumiVoice,
  SpeechOptions,
  SpeechVoice,
} from "../src/audio/speechController";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const voices: SpeechVoice[] = [
  {
    identifier: "pt-PT-default",
    name: "Português",
    quality: "Enhanced",
    language: "pt-PT",
  },
  {
    identifier: "pt-BR-felipe",
    name: "Felipe",
    quality: "Enhanced",
    language: "pt-BR",
  },
  {
    identifier: "pt-BR-luciana",
    name: "Luciana Premium",
    quality: "Enhanced",
    language: "pt-BR",
  },
];

function driver(overrides: Partial<{
  stop: () => Promise<void>;
  speak: (text: string, options: SpeechOptions) => void;
  getAvailableVoices: () => Promise<SpeechVoice[]>;
}> = {}) {
  return {
    stop: () => Promise.resolve(),
    speak: () => undefined,
    getAvailableVoices: () => Promise.resolve(voices),
    ...overrides,
  };
}

test("selects the most natural female Brazilian voice when available", () => {
  assert.equal(selectLumiVoice(voices)?.identifier, "pt-BR-luciana");
  assert.equal(selectLumiVoice(voices.slice(0, 1)), undefined);
});

test("prepares the requested Lumi voice examples with meaningful punctuation", () => {
  const examples = [
    "Onde está a cama?",
    "Qual objeto é vermelho?",
    "Vamos guardar o ursinho?",
    "Muito bem! Você conseguiu!",
  ];

  assert.deepEqual(examples.map(prepareLumiSpeechText), examples);
});

test("removes interface prefixes, emoji and unnecessary characters", () => {
  assert.equal(
    prepareLumiSpeechText("Ouvir: 🌻 Vamos brincar — com calma •"),
    "Vamos brincar, com calma.",
  );
});

test("uses pt-BR, a natural pitch and expressive rates", async () => {
  const spoken: Array<{ text: string; options: SpeechOptions }> = [];
  const controller = createLumiVoiceService(
    driver({ speak: (text, options) => spoken.push({ text, options }) }),
    () => undefined,
  );

  await controller.play("Onde está a cama?");
  await controller.play("Muito bem! Você conseguiu!");
  await controller.play("A cama está aqui.");

  assert.deepEqual(
    spoken.map(({ text, options }) => ({
      text,
      language: options.language,
      voice: options.voice,
      rate: options.rate,
      pitch: options.pitch,
    })),
    [
      {
        text: "Onde está a cama?",
        language: "pt-BR",
        voice: "pt-BR-luciana",
        rate: 0.84,
        pitch: 1,
      },
      {
        text: "Muito bem! Você conseguiu!",
        language: "pt-BR",
        voice: "pt-BR-luciana",
        rate: 0.88,
        pitch: 1,
      },
      {
        text: "A cama está aqui.",
        language: "pt-BR",
        voice: "pt-BR-luciana",
        rate: 0.86,
        pitch: 1,
      },
    ],
  );
});

test("rapid replay speaks only the latest instruction", async () => {
  const firstStop = deferred();
  const secondStop = deferred();
  const stops = [firstStop, secondStop];
  const spoken: string[] = [];
  let stopIndex = 0;
  const controller = createLumiVoiceService(
    driver({
      stop: () => stops[stopIndex++].promise,
      speak: (text) => spoken.push(text),
    }),
    () => undefined,
  );

  const firstPlay = controller.play("primeira");
  const secondPlay = controller.play("segunda");
  firstStop.resolve();
  await firstPlay;
  assert.deepEqual(spoken, []);

  secondStop.resolve();
  await secondPlay;
  assert.deepEqual(spoken, ["segunda."]);
});

test("pending speech cannot start after the button unmounts", async () => {
  const pendingStop = deferred();
  const spoken: string[] = [];
  let stopCalls = 0;
  const controller = createLumiVoiceService(
    driver({
      stop: () => {
        stopCalls += 1;
        return stopCalls === 1 ? pendingStop.promise : Promise.resolve();
      },
      speak: (text) => spoken.push(text),
    }),
    () => undefined,
  );

  const play = controller.play("não deve tocar");
  controller.dispose();
  pendingStop.resolve();
  await play;

  assert.deepEqual(spoken, []);
  assert.equal(stopCalls, 2);
});

test("a stale callback cannot stop the latest playing indicator", async () => {
  const states: boolean[] = [];
  const options: SpeechOptions[] = [];
  const controller = createLumiVoiceService(
    driver({ speak: (_text, speechOptions) => options.push(speechOptions) }),
    (playing) => states.push(playing),
  );

  await controller.play("primeira");
  await controller.play("segunda");
  options[0].onDone();
  assert.deepEqual(states, [true, true]);

  options[1].onDone();
  assert.deepEqual(states, [true, true, false]);
});