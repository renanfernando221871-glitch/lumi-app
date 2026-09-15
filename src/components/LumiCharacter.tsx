import React from "react";

export type LumiExpression =
  | "curious"
  | "happy"
  | "encouraging"
  | "celebrating";
export type LumiSize = "small" | "medium" | "large";

type Props = {
  expression?: LumiExpression;
  size?: LumiSize;
  accessibilityLabel?: string;
};

export function LumiCharacter({
  expression: _expression = "happy",
  size: _size = "medium",
  accessibilityLabel: _accessibilityLabel = "Lumi",
}: Props) {
  // The official Lumi image has not been supplied yet. Identity policy forbids
  // rendering a substitute character, emoji, placeholder, or redrawn fallback.
  return null;
}