import { ActivityDefinition } from "../types";

export const tapFixture: ActivityDefinition = {
  id: "test-tap-star",
  worldId: "test-world",
  engineType: "tap-and-find",
  title: "Encontre a estrela",
  instructionText: "Toque na estrela.",
  instructionAudio: "test-tap-star.mp3",
  audioLabel: "Ouvir: Toque na estrela.",
  learningGoal: "Identificar uma estrela.",
  difficulty: "easy",
  successFeedback: "Muito bem!",
  retryFeedback: "Tente outra vez.",
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
  instructionAudio: "test-drag-shell.mp3",
  audioLabel: "Ouvir: Leve a concha até o baú.",
  learningGoal: "Praticar coordenação.",
  difficulty: "easy",
  successFeedback: "Muito bem!",
  retryFeedback: "Tente outra vez.",
  hint: "Arraste a concha.",
  config: {
    pairs: [{ draggableItemId: "shell", targetId: "chest" }],
    items: [
      { id: "shell", label: "concha", emoji: "🐚", color: "#F7A49B" },
      { id: "chest", label: "baú", emoji: "🧰", color: "#FFC442" },
    ],
  },
};