import assert from "node:assert/strict";
import test from "node:test";
import {
  createSpeechController,
  SpeechOptions,
} from "../src/audio/speechController";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test("rapid replay speaks only the latest instruction", async () => {
  const firstStop = deferred();
  const secondStop = deferred();
  const stops = [firstStop, secondStop];
  const spoken: string[] = [];
  let stopIndex = 0;
  const controller = createSpeechController(
    {
      stop: () => stops[stopIndex++].promise,
      speak: (text) => spoken.push(text),
    },
    () => undefined,
  );

  const firstPlay = controller.play("primeira");
  const secondPlay = controller.play("segunda");
  firstStop.resolve();
  await firstPlay;
  assert.deepEqual(spoken, []);

  secondStop.resolve();
  await secondPlay;
  assert.deepEqual(spoken, ["segunda"]);
});

test("pending speech cannot start after the button unmounts", async () => {
  const pendingStop = deferred();
  const spoken: string[] = [];
  let stopCalls = 0;
  const controller = createSpeechController(
    {
      stop: () => {
        stopCalls += 1;
        return stopCalls === 1 ? pendingStop.promise : Promise.resolve();
      },
      speak: (text) => spoken.push(text),
    },
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
  const controller = createSpeechController(
    {
      stop: () => Promise.resolve(),
      speak: (_text, speechOptions) => options.push(speechOptions),
    },
    (playing) => states.push(playing),
  );

  await controller.play("primeira");
  await controller.play("segunda");
  options[0].onDone();
  assert.deepEqual(states, [true, true]);

  options[1].onDone();
  assert.deepEqual(states, [true, true, false]);
});