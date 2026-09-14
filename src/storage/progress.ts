import AsyncStorage from "@react-native-async-storage/async-storage";
import { activities } from "../data/activities";
import { ChildProfile, ProgressState } from "../types";
import {
  createEnvelope,
  normalizeProfile,
  normalizeProgress,
  parseStoredJson,
} from "./schema";

const PROFILE_KEY = "@lumi/profile";
const PROGRESS_KEY = "@lumi/progress";

export const defaultProfile: ChildProfile = {
  name: "",
  avatar: "🌻",
  hasOnboarded: false,
};

export const defaultProgress: ProgressState = {
  completedActivityIds: [],
  earnedReward: false,
};

export async function loadSavedState() {
  const catalogIds = activities.map((activity) => activity.id);
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