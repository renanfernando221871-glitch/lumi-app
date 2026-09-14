import { validateWorldCatalog } from "../domain/catalog";
import { activities } from "./activities";
import { WorldDefinition } from "../types";
import { rewards } from "./rewards";

export const casaDoLumi: WorldDefinition = {
  id: "casa-do-lumi",
  title: "Casa do Lumi",
  description: "Um cantinho acolhedor para descobrir e aprender.",
  activityIds: activities.map((activity) => activity.id),
  rewardId: "lumi-flower",
  unlock: { unlockedByDefault: true },
  assets: {
    mapIcon: "🏡",
    mapPrompt: "A Casa do Lumi está pertinho. Vamos olhar lá dentro?",
    entryLabel: "Entrar na casa",
  },
};

/** Worlds are data, so adding a world does not require changing navigation. */
export const worldCatalog: readonly WorldDefinition[] = [casaDoLumi];
export const worlds = worldCatalog;

if (process.env.NODE_ENV !== "production") {
  validateWorldCatalog(
    worldCatalog,
    activities,
    rewards.map((reward) => reward.id),
  );
}