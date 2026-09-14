export type ActivityKind = "find" | "color" | "drag";

export type ActivityItem = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  isTarget?: boolean;
};

export type ActivityDefinition = {
  id: string;
  kind: ActivityKind;
  title: string;
  instruction: string;
  audioLabel: string;
  helper: string;
  items: ActivityItem[];
  targetId: string;
  reward: string;
};

export type ChildProfile = {
  name: string;
  avatar: string;
  hasOnboarded: boolean;
};

export type ProgressState = {
  completedActivityIds: string[];
  earnedReward: boolean;
};

export type ScreenName =
  | "splash"
  | "welcome"
  | "personalize"
  | "map"
  | "house"
  | "activity";