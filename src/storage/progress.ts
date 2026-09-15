import AsyncStorage from "@react-native-async-storage/async-storage";
import { worldCatalog } from "../data/worlds";
import { rewards } from "../data/rewards";
import { ChildProfile, ProgressState } from "../types";
import {
  createEnvelope,
  normalizeProfile,
  normalizeProgress,
  parseStoredJson,
} from "./schema";

const PROFILE_KEY = "@lumi/profile";
const PROGRESS_KEY = "@lumi/progress";
const PREVIEW_RESET_KEY = "@lumi/preview-progress-reset";
const PREVIEW_RESET_VERSION = "farm-first-world-order-v1";

export const defaultProfile: ChildProfile = {
  name: "",
  avatar: "🌻",
  hasOnboarded: false,
};

export const defaultProgress: ProgressState = {
  completedActivityIds: [],
  earnedRewardIds: [],
};

/**
 * Clears stale progress once in the local web Preview after progression rules
 * change. Published builds never call this function.
 */
export async function preparePreviewProgress(force = false) {
  const appliedVersion = await AsyncStorage.getItem(PREVIEW_RESET_KEY);
  if (!force && appliedVersion === PREVIEW_RESET_VERSION) return;
  await AsyncStorage.removeItem(PROGRESS_KEY);
  await AsyncStorage.setItem(PREVIEW_RESET_KEY, PREVIEW_RESET_VERSION);
}

export async function loadSavedState() {
  const catalogIds = worldCatalog.flatMap((world) => world.activityIds);
  try {
    const [profileValue, progressValue] = await Promise.all([
      AsyncStorage.getItem(PROFILE_KEY),
      AsyncStorage.getItem(PROGRESS_KEY),
    ]);

    return {
      profile: normalizeProfile(parseStoredJson(profileValue), defaultProfile),
      progress: normalizeProgress(
        parseStoredJson(progressValue),
        defaultProgress,
        catalogIds,
        rewards.map((reward) => reward.id),
      ),
    };
  } catch (error) {
    console.warn("[Lumi storage] Não foi possível ler o progresso local.", error);
    return { profile: defaultProfile, progress: defaultProgress };
  }
}

export async function saveProfile(profile: ChildProfile) {
  try {
    await AsyncStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(createEnvelope(profile)),
    );
  } catch (error) {
    throw new Error(
      `[Lumi storage] Falha ao salvar o perfil: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export async function saveProgress(progress: ProgressState) {
  try {
    await AsyncStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify(createEnvelope(progress)),
    );
  } catch (error) {
    throw new Error(
      `[Lumi storage] Falha ao salvar o progresso: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}