import { ActivityDefinition } from "../types";

/** The production activities for Casa do Lumi. IDs are persistence contracts. */
export const activities: ActivityDefinition[] = [
  {
    id: "find-bed",
    worldId: "casa-do-lumi",
    engineType: "tap-and-find",
    title: "Encontre a cama",
    instructionText: "Onde a Lumi pode descansar?",
    instructionAudio: "activity-01-find-bed.mp3",
    audioLabel: "Ouvir: Onde a Lumi pode descansar?",
    objective: "Identificar um lugar seguro para descansar.",
    difficulty: "easy",
    feedbackSuccess: "Você encontrou um cantinho gostoso!",
    feedbackAttempt: "Quase! Vamos olhar mais uma vez juntos.",
    hint: "Toque na cama bem macia.",
    config: {
      targetId: "bed",
      items: [
        { id: "lamp", label: "abajur", emoji: "🛋️", color: "#FFD88A" },
        { id: "bed", label: "cama", emoji: "🛏️", color: "#9CC9F5", isTarget: true },
        { id: "plant", label: "plantinha", emoji: "🪴", color: "#9DDD83" },
        { id: "book", label: "livro", emoji: "📚", color: "#F7A49B" },
      ],
    },
  },
  {
    id: "red-object",
    worldId: "casa-do-lumi",
    engineType: "tap-and-find",
    title: "Qual objeto é vermelho?",
    instructionText: "Você encontra o objeto vermelho?",
    instructionAudio: "activity-02-red-object.mp3",
    audioLabel: "Ouvir: Você encontra o objeto vermelho?",
    objective: "Reconhecer a cor vermelha.",
    difficulty: "easy",
    feedbackSuccess: "Isso! Vermelho como uma maçã!",
    feedbackAttempt: "Quase! Vamos olhar mais uma vez juntos.",
    hint: "Escolha uma cor bem vermelhinha.",
    config: {
      presentation: "color-options",
      targetId: "apple",
      items: [
        { id: "apple", label: "maçã", emoji: "🍎", color: "#F7796F", isTarget: true },
        { id: "sun", label: "sol", emoji: "☀️", color: "#FFC442" },
        { id: "leaf", label: "folha", emoji: "🍃", color: "#53B94A" },
        { id: "cloud", label: "nuvem", emoji: "☁️", color: "#BBDCF9" },
      ],
    },
  },
  {
    id: "store-teddy",
    worldId: "casa-do-lumi",
    engineType: "drag-to-target",
    title: "Guarde o ursinho",
    instructionText: "Leve o ursinho para a caixa.",
    instructionAudio: "activity-03-store-teddy.mp3",
    audioLabel: "Ouvir: Leve o ursinho para a caixa.",
    objective: "Praticar coordenação ao guardar um objeto.",
    difficulty: "easy",
    feedbackSuccess: "Muito bem! O ursinho está guardado!",
    feedbackAttempt: "Tente levar o objeto até a caixa.",
    hint: "Segure o ursinho e arraste até a caixa.",
    config: {
      draggableItemId: "teddy",
      targetId: "toy-box",
      items: [
        { id: "teddy", label: "ursinho", emoji: "🧸", color: "#C98759" },
        { id: "toy-box", label: "caixa", emoji: "🧺", color: "#FFC442", isTarget: true },
      ],
    },
  },
];

export const totalActivities = activities.length;