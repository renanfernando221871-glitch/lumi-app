import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChildProfile, ProgressState } from "../types";

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
  try {
    const [profileValue, progressValue] = await Promise.all([
      AsyncStorage.getItem(PROFILE_KEY),
      AsyncStorage.getItem(PROGRESS_KEY),
    ]);

    return {
      profile: profileValue
        ? { ...defaultProfile, ...JSON.parse(profileValue) }
        : defaultProfile,
      progress: progressValue
        ? { ...defaultProgress, ...JSON.parse(progressValue) }
        : defaultProgress,
    };
  } catch {
    return { profile: defaultProfile, progress: defaultProgress };
  }
}

export async function saveProfile(profile: ChildProfile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function saveProgress(progress: ProgressState) {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}