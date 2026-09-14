import { validateWorldCatalog } from "../domain/catalog";
import { activities } from "./activities";
import { WorldDefinition } from "../types";
import { rewards } from "./rewards";

export const casaDoLumi: WorldDefinition = {
  id: "casa-do-lumi",
  title: "Casa do Lumi",
  description: "Um cantinho acolhedor para descobrir e aprender.",
  activityIds: activities
    .filter((activity) => activity.worldId === "casa-do-lumi")
    .map((activity) => activity.id),
  rewardId: "lumi-flower",
  unlock: { unlockedByDefault: true },
  assets: {
    mapIcon: "🏡",
    mapPrompt: "A Casa do Lumi está pertinho. Vamos olhar lá dentro?",
    entryLabel: "Entrar na casa",
    introPrompt:
      "Vamos cuidar da casa juntos? Cada brincadeira esconde uma descoberta.",
  },
};

export const fazendaDasDescobertas: WorldDefinition = {
  id: "fazenda-das-descobertas",
  title: "Fazenda das Descobertas",
  description: "Um lugar para descobrir animais, tamanhos e a colheita.",
  activityIds: activities
    .filter((activity) => activity.worldId === "fazenda-das-descobertas")
    .map((activity) => activity.id),
  rewardId: "farm-basket",
  unlock: {
    unlockedByDefault: false,
    prerequisiteWorldId: "casa-do-lumi",
  },
  assets: {
    mapIcon: "🚜",
    mapPrompt: "A Fazenda das Descobertas está logo ali. Vamos explorar?",
    entryLabel: "Entrar na fazenda",
    introPrompt:
      "Vamos explorar a fazenda juntos? Cada animal guarda uma descoberta.",
  },
};

/** Worlds are data, so adding a world does not require changing navigation. */
export const worldCatalog: readonly WorldDefinition[] = [
  casaDoLumi,
  fazendaDasDescobertas,
];
export const worlds = worldCatalog;

if (process.env.NODE_ENV !== "production") {
  validateWorldCatalog(
    worldCatalog,
    activities,
    rewards.map((reward) => reward.id),
  );
}