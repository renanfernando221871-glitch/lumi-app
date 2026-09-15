import React from "react";
import { RewardModal } from "../components/RewardModal";
import { RewardDefinition } from "../types";

export function RewardScreen({
  reward,
  unlockMessage,
  onClose,
}: {
  reward: RewardDefinition;
  unlockMessage?: string;
  onClose: () => void;
}) {
  return (
    <RewardModal
      visible
      reward={reward}
      unlockMessage={unlockMessage}
      onClose={onClose}
    />
  );
}