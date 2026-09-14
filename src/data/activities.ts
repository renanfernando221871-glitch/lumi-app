import { ActivityDefinition } from "../types";

export const activities: ActivityDefinition[] = [
  {
    id: "find-bed",
    kind: "find",
    title: "Encontre a cama",
    instruction: "Onde a Lumi pode descansar?",
    audioLabel: "Ouvir: Onde a Lumi pode descansar?",
    helper: "Toque na cama bem macia.",
    targetId: "bed",
    reward: "Você encontrou um cantinho gostoso!",
    items: [
      { id: "lamp", label: "abajur", emoji: "🛋️", color: "#FFD88A" },
      { id: "bed", label: "cama", emoji: "🛏️", color: "#9CC9F5", isTarget: true },
      { id: "plant", label: "plantinha", emoji: "🪴", color: "#9DDD83" },
      { id: "book", label: "livro", emoji: "📚", color: "#F7A49B" },
    ],
  },
  {
    id: "red-object",
    kind: "color",
    title: "Qual objeto é vermelho?",
    instruction: "Você encontra o objeto vermelho?",
    audioLabel: "Ouvir: Você encontra o objeto vermelho?",
    helper: "Escolha uma cor bem vermelhinha.",
    targetId: "apple",
    reward: "Isso! Vermelho como uma maçã!",
    items: [
      { id: "apple", label: "maçã", emoji: "🍎", color: "#F7796F", isTarget: true },
      { id: "sun", label: "sol", emoji: "☀️", color: "#FFC442" },
      { id: "leaf", label: "folha", emoji: "🍃", color: "#53B94A" },
      { id: "cloud", label: "nuvem", emoji: "☁️", color: "#BBDCF9" },
    ],
  },
  {
    id: "store-teddy",
    kind: "drag",
    title: "Guarde o ursinho",
    instruction: "Leve o ursinho para a caixa.",
    audioLabel: "Ouvir: Leve o ursinho para a caixa.",
    helper: "Segure o ursinho e arraste até a caixa.",
    targetId: "toy-box",
    reward: "Muito bem! O ursinho está guardado!",
    items: [
      { id: "teddy", label: "ursinho", emoji: "🧸", color: "#C98759" },
      { id: "toy-box", label: "caixa", emoji: "🧺", color: "#FFC442", isTarget: true },
    ],
  },
];

export const totalActivities = activities.length;