import React from "react";
import { RewardModal } from "../components/RewardModal";
import { RewardDefinition } from "../types";

export function RewardScreen({
  reward,
  onClose,
}: {
  reward: RewardDefinition;
  onClose: () => void;
}) {
  return <RewardModal visible reward={reward} onClose={onClose} />;
}