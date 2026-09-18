import { WorldDefinition } from "../types";

export const casaDoLumi: WorldDefinition = {
  id: "casa-do-lumi",
  title: "Casa da Lumi",
  description: "Um cantinho acolhedor para descobrir e aprender.",
  activityIds: ["find-bed", "red-object", "store-teddy", "big-or-small", "count-apples", "identify-shape", "lumi-emotion", "tidy-room"],
  unlock: {
    unlockedByDefault: false,
    prerequisiteWorldId: "fazenda-das-descobertas",
  },
  assets: {
    mapIcon: "🏡",
    mapPrompt: "A Casa da Lumi está pertinho. Vamos olhar lá dentro?",
    entryLabel: "Entrar na casa",
    introPrompt:
      "Vamos cuidar da casa juntos? Cada brincadeira esconde uma descoberta.",
  },
};

export const fazendaDasDescobertas: WorldDefinition = {
  id: "fazenda-das-descobertas",
  title: "Fazenda das Descobertas",
  description: "Um lugar para descobrir animais, tamanhos e a colheita.",
  activityIds: ["farm-who-moo", "farm-find-horse", "farm-brown-animal", "farm-count-chicks", "farm-order-size", "farm-who-gives-what", "farm-front-or-back", "farm-help-harvest"],
  unlock: {
    unlockedByDefault: true,
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
  activityIds: ["parque-kites", "parque-shapes", "parque-above-below", "parque-count-ducks", "parque-sequence", "parque-right-path", "parque-speed", "parque-real-world"],
  unlock: {
    unlockedByDefault: false,
    prerequisiteWorldId: "casa-do-lumi",
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
  title: "Mercado da Lumi",
  description: "Um mercado alegre para escolher, contar e organizar alimentos.",
  activityIds: ["mercado-find-apple", "mercado-two-bananas", "mercado-fruit-or-vegetable", "mercado-which-has-more", "mercado-what-disappeared", "mercado-what-color", "mercado-first-sound", "mercado-prepare-snack"],
  unlock: {
    unlockedByDefault: false,
    prerequisiteWorldId: "parque-das-cores",
  },
  assets: {
    mapIcon: "🏪",
    mapPrompt: "O Mercado da Lumi apareceu no caminho. Vamos fazer descobertas?",
    entryLabel: "Entrar no mercado",
    introPrompt:
      "Vamos passear pelo mercado? Há alimentos, sons e escolhas para descobrir.",
  },
};

export const cidadeDasAventuras: WorldDefinition = {
  id: "cidade-das-aventuras",
  title: "Cidade das Aventuras",
  description: "Uma cidade para descobrir pessoas, lugares, escolhas e histórias.",
  activityIds: ["cidade-who-drives", "cidade-car-sound", "cidade-where-to-go", "cidade-cross-safely", "cidade-who-is-sad", "cidade-help-friend", "cidade-build-sentence", "cidade-lumi-story"],
  unlock: {
    unlockedByDefault: false,
    prerequisiteWorldId: "mercado-do-lumi",
  },
  assets: {
    mapIcon: "🏙️",
    mapPrompt: "Uma cidade apareceu no caminho. Vamos descobrir suas aventuras?",
    entryLabel: "Entrar na cidade",
    introPrompt:
      "Vamos passear pela cidade? Há pessoas, lugares e histórias para descobrir.",
  },
};

/** Worlds are data, so adding a world does not require changing navigation. */
export const worldCatalog: readonly WorldDefinition[] = [
  fazendaDasDescobertas,
  casaDoLumi,
  parqueDasCores,
  mercadoDoLumi,
  cidadeDasAventuras,
];
export const worlds = worldCatalog;
