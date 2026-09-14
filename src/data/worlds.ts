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

export const parqueDasCores: WorldDefinition = {
  id: "parque-das-cores",
  title: "Parque das Cores",
  description: "Um parque alegre para descobrir cores, formas e caminhos.",
  activityIds: activities
    .filter((activity) => activity.worldId === "parque-das-cores")
    .map((activity) => activity.id),
  rewardId: "parque-rainbow",
  unlock: {
    unlockedByDefault: false,
    prerequisiteWorldId: "fazenda-das-descobertas",
  },
  assets: {
    mapIcon: "🎨",
    mapPrompt: "O Parque das Cores está logo ali. Vamos descobrir juntos?",
    entryLabel: "Entrar no parque",
    introPrompt:
      "Vamos passear pelo parque? Cada cor esconde uma descoberta.",
  },
};

export const mercadoDoLumi: WorldDefinition = {
  id: "mercado-do-lumi",
  title: "Mercado do Lumi",
  description: "Um mercado alegre para escolher, contar e organizar alimentos.",
  activityIds: activities
    .filter((activity) => activity.worldId === "mercado-do-lumi")
    .map((activity) => activity.id),
  rewardId: "mercado-bag",
  unlock: {
    unlockedByDefault: false,
    prerequisiteWorldId: "parque-das-cores",
  },
  assets: {
    mapIcon: "🏪",
    mapPrompt: "O Mercado do Lumi apareceu no caminho. Vamos fazer descobertas?",
    entryLabel: "Entrar no mercado",
    introPrompt:
      "Vamos passear pelo mercado? Há alimentos, sons e escolhas para descobrir.",
  },
};

/** Worlds are data, so adding a world does not require changing navigation. */
export const worldCatalog: readonly WorldDefinition[] = [
  casaDoLumi,
  fazendaDasDescobertas,
  parqueDasCores,
  mercadoDoLumi,
];
export const worlds = worldCatalog;

if (process.env.NODE_ENV !== "production") {
  validateWorldCatalog(
    worldCatalog,
    activities,
    rewards.map((reward) => reward.id),
  );
}