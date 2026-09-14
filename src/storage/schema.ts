import { ChildProfile, ProgressState } from "../types";

export const STORAGE_SCHEMA_VERSION = 1;

type PersistedEnvelope = {
  schemaVersion: number;
  data: unknown;
};

export function parseStoredJson(raw: string | null): unknown {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapPersistedData(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if (!("schemaVersion" in value)) return value;
  if (
    value.schemaVersion !== STORAGE_SCHEMA_VERSION ||
    !("data" in value)
  ) {
    return null;
  }
  return (value as PersistedEnvelope).data;
}

export function createEnvelope<T>(data: T) {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    data,
  };
}

export function normalizeProfile(
  value: unknown,
  defaults: ChildProfile,
): ChildProfile {
  const data = unwrapPersistedData(value);
  if (!isRecord(data)) return { ...defaults };

  const name =
    typeof data.name === "string" ? data.name.trim().slice(0, 18) : defaults.name;
  const avatar =
    typeof data.avatar === "string" && data.avatar.trim()
      ? data.avatar
      : defaults.avatar;

  return {
    name,
    avatar,
    hasOnboarded:
      typeof data.hasOnboarded === "boolean"
        ? data.hasOnboarded
        : defaults.hasOnboarded,
  };
}

export function normalizeProgress(
  value: unknown,
  defaults: ProgressState,
  catalogIds: string[],
): ProgressState {
  const data = unwrapPersistedData(value);
  if (!isRecord(data)) return { ...defaults, completedActivityIds: [] };

  const knownIds = new Set(catalogIds);
  const candidateIds = Array.isArray(data.completedActivityIds)
    ? data.completedActivityIds
    : [];
  const completedActivityIds = Array.from(
    new Set(
      candidateIds.filter(
        (id): id is string => typeof id === "string" && knownIds.has(id),
      ),
    ),
  );

  return {
    completedActivityIds,
    earnedReward:
      typeof data.earnedReward === "boolean"
        ? data.earnedReward
        : defaults.earnedReward,
  };
}