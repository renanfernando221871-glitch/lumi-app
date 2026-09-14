export type ActivityEngineType = "tap-and-find" | "drag-to-target";

export type ActivityItem = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  isTarget?: boolean;
};

type ActivityContent = {
  id: string;
  worldId: string;
  title: string;
  instructionText: string;
  instructionAudio?: string;
  audioLabel: string;
  objective: string;
  difficulty: "easy" | "medium" | "hard";
  feedbackSuccess: string;
  feedbackAttempt: string;
  hint: string;
};

export type TapAndFindActivity = ActivityContent & {
  engineType: "tap-and-find";
  config: {
    items: ActivityItem[];
    targetId: string;
    presentation?: "grid" | "color-options";
  };
};
export type TapAndFindActivityDefinition = TapAndFindActivity;

export type DragToTargetActivity = ActivityContent & {
  engineType: "drag-to-target";
  config: {
    items: ActivityItem[];
    targetId: string;
    draggableItemId: string;
  };
};
export type DragToTargetActivityDefinition = DragToTargetActivity;

export type ActivityDefinition = TapAndFindActivity | DragToTargetActivity;

export type ActivityInteraction = {
  completed: boolean;
  feedback?: string;
};

export type ActivityResult = {
  activityId: string;
  completed: boolean;
  attempts: number;
  startedAt: number;
  completedAt: number;
};

export type WorldDefinition = {
  id: string;
  title: string;
  description: string;
  activityIds: string[];
  rewardId: string;
  unlock: {
    unlockedByDefault: boolean;
  };
  assets: {
    mapIcon: string;
    mapPrompt: string;
    entryLabel: string;
  };
};

export type RewardDefinition = {
  id: string;
  icon: string;
  eyebrow: string;
  title: string;
  message: string;
  progressLockedIcon: string;
};
export type WorldCatalog = readonly WorldDefinition[];

export type ChildProfile = {
  name: string;
  avatar: string;
  hasOnboarded: boolean;
};

export type ProgressState = {
  completedActivityIds: string[];
  earnedRewardIds: string[];
};