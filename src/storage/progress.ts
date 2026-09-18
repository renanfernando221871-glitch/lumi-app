import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChildProfile, ProgressState } from "../types";
import {
  createEnvelope,
  normalizeProfile,
  parseStoredJson,
} from "./schema";

const PROFILE_KEY = "@lumi/profile";

export const defaultProfile: ChildProfile = {
  name: "",
  avatar: "🌻",
  hasOnboarded: false,
};

export const defaultProgress: ProgressState = {
  completedActivityIds: [],
  earnedRewardIds: [],
};

export async function loadSavedState() {
  try {
    const profileValue = await AsyncStorage.getItem(PROFILE_KEY);
    return {
      profile: normalizeProfile(parseStoredJson(profileValue), defaultProfile),
      progress: defaultProgress,
    };
  } catch (error) {
    console.warn("[Lumi storage] Não foi possível ler o perfil local.", error);
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