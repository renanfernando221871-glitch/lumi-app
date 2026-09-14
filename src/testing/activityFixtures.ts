import { ActivityDefinition } from "../types";

export const tapFixture: ActivityDefinition = {
  id: "test-tap-star",
  worldId: "test-world",
  engineType: "tap-and-find",
  title: "Encontre a estrela",
  instructionText: "Toque na estrela.",
  audioLabel: "Ouvir: Toque na estrela.",
  objective: "Identificar uma estrela.",
  difficulty: "easy",
  feedbackSuccess: "Muito bem!",
  feedbackAttempt: "Tente outra vez.",
  hint: "Procure a estrela brilhante.",
  config: {
    targetId: "star",
    items: [
      { id: "moon", label: "lua", emoji: "🌙", color: "#BBDCF9" },
      { id: "star", label: "estrela", emoji: "⭐", color: "#FFC442" },
    ],
  },
};

export const dragFixture: ActivityDefinition = {
  id: "test-drag-shell",
  worldId: "test-world",
  engineType: "drag-to-target",
  title: "Guarde a concha",
  instructionText: "Leve a concha até o baú.",
  audioLabel: "Ouvir: Leve a concha até o baú.",
  objective: "Praticar coordenação.",
  difficulty: "easy",
  feedbackSuccess: "Muito bem!",
  feedbackAttempt: "Tente outra vez.",
  hint: "Arraste a concha.",
  config: {
    draggableItemId: "shell",
    targetId: "chest",
    items: [
      { id: "shell", label: "concha", emoji: "🐚", color: "#F7A49B" },
      { id: "chest", label: "baú", emoji: "🧰", color: "#FFC442" },
    ],
  },
};