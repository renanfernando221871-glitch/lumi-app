export const LUMI_LANGUAGE = "pt-BR";

export type SpeechVoice = {
  identifier: string;
  name: string;
  quality: "Default" | "Enhanced";
  language: string;
};

export type SpeechOptions = {
  language: string;
  voice?: string;
  rate: number;
  pitch: number;
  onDone: () => void;
  onStopped: () => void;
  onError: () => void;
};

export type SpeechDriver = {
  stop: () => Promise<void>;
  speak: (text: string, options: SpeechOptions) => void;
  getAvailableVoices: () => Promise<SpeechVoice[]>;
};

export type LumiVoiceService = {
  play: (text: string) => Promise<void>;
  dispose: () => void;
};

const FEMALE_VOICE_HINTS = [
  "female",
  "feminina",
  "luciana",
  "thalita",
  "leticia",
  "letícia",
  "fernanda",
  "camila",
  "francisca",
  "sandy",
  "shelley",
  "flo",
];

const MALE_VOICE_HINTS = ["male", "masculina", "felipe", "ricardo"];
const NATURAL_VOICE_HINTS = ["natural", "neural", "premium", "enhanced"];

function normalizedLocale(locale: string) {
  return locale.toLowerCase().replace("_", "-");
}

function scoreVoice(voice: SpeechVoice) {
  const language = normalizedLocale(voice.language);
  const searchableName = `${voice.name} ${voice.identifier}`.toLowerCase();
  let score = 0;

  if (language === "pt-br") score += 100;
  else if (language.startsWith("pt-")) score += 25;
  if (voice.quality === "Enhanced") score += 20;
  if (NATURAL_VOICE_HINTS.some((hint) => searchableName.includes(hint))) score += 15;
  if (FEMALE_VOICE_HINTS.some((hint) => searchableName.includes(hint))) score += 30;
  if (MALE_VOICE_HINTS.some((hint) => searchableName.includes(hint))) score -= 25;

  return score;
}

export function selectLumiVoice(voices: SpeechVoice[]): SpeechVoice | undefined {
  const brazilianVoices = voices.filter(
    (voice) => normalizedLocale(voice.language) === "pt-br",
  );

  return brazilianVoices
    .map((voice, index) => ({ voice, index, score: scoreVoice(voice) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.voice;
}

export function prepareLumiSpeechText(text: string): string {
  const withoutInterfacePrefix = text.replace(/^\s*(ouvir|áudio)\s*:\s*/iu, "");
  const withoutEmoji = withoutInterfacePrefix
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .replace(/[•▪◦★☆→←]/g, " ");
  const withNaturalPauses = withoutEmoji
    .replace(/\s*([;:—–])\s*/g, ", ")
    .replace(/([.!?])(?=\S)/g, "$1 ");
  const normalized = withNaturalPauses.replace(/\s+/g, " ").trim();

  if (!normalized) return "";
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function getRate(text: string) {
  if (text.endsWith("?")) return 0.84;
  if (text.endsWith("!")) return 0.88;
  return 0.86;
}

async function findAvailableLumiVoice(
  getAvailableVoices: SpeechDriver["getAvailableVoices"],
): Promise<SpeechVoice | undefined> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      getAvailableVoices().then(selectLumiVoice),
      new Promise<undefined>((resolve) => {
        timeout = setTimeout(() => resolve(undefined), 800);
      }),
    ]);
  } catch {
    return undefined;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export function createLumiVoiceService(
  driver: SpeechDriver,
  onPlayingChange: (isPlaying: boolean) => void,
): LumiVoiceService {
  let requestId = 0;
  let mounted = true;
  let selectedVoice: SpeechVoice | undefined;
  let voiceLookup: Promise<SpeechVoice | undefined> | undefined;

  const getVoice = () => {
    voiceLookup ??= findAvailableLumiVoice(driver.getAvailableVoices);
    return voiceLookup;
  };

  const finishIfCurrent = (id: number) => {
    if (mounted && requestId === id) {
      onPlayingChange(false);
    }
  };

  return {
    async play(rawText: string) {
      const text = prepareLumiSpeechText(rawText);
      if (!text) return;

      const id = ++requestId;
      onPlayingChange(true);

      try {
        await driver.stop();
        if (!mounted || requestId !== id) return;

        selectedVoice ??= await getVoice();
        if (!mounted || requestId !== id) return;

        driver.speak(text, {
          language: LUMI_LANGUAGE,
          voice: selectedVoice?.identifier,
          rate: getRate(text),
          pitch: 1,
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