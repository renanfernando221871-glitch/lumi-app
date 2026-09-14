import { RewardDefinition } from "../types";

export const rewards: readonly RewardDefinition[] = [
  {
    id: "lumi-flower",
    icon: "🌼",
    progressLockedIcon: "🌱",
    eyebrow: "CONQUISTA NOVA",
    title: "Nossa primeira\nflor nasceu!",
    message: "Você cuidou de cada atividade. Que bonito crescer junto!",
  },
];

export function getRewardById(rewardId: string): RewardDefinition {
  const reward = rewards.find((candidate) => candidate.id === rewardId);
  if (!reward) {
    throw new Error(`[Lumi catalog] Unknown reward "${rewardId}".`);
  }
  return reward;
}