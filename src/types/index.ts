export type ActivityEngineType =
  | "tap-and-find"
  | "drag-to-target"
  | "count-and-select"
  | "ordering"
  | "pattern-completion"
  | "real-world-challenge";

export type ActivityItem = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  /** Optional text glyph whose fill color comes from `color`. */
  colorGlyph?: string;
  isTarget?: boolean;
  emojiScale?: number;
};

type ActivityContent = {
  id: string;
  worldId: string;
  title: string;
  instructionText: string;
  instructionAudio: string;
  audioLabel: string;
  learningGoal: string;
  difficulty: "easy" | "medium" | "hard";
  successFeedback: string;
  retryFeedback: string;
  hint: string;
  previewEmoji: string;
};

export type TapAndFindActivity = ActivityContent & {
  engineType: "tap-and-find";
  config: {
    items: ActivityItem[];
    targetId: string;
    presentation?: "grid" | "color-options";
    featuredEmoji?: string;
    featuredLabel?: string;
  };
};
export type TapAndFindActivityDefinition = TapAndFindActivity;

export type DragToTargetActivity = ActivityContent & {
  engineType: "drag-to-target";
  config: {
    items: ActivityItem[];
    dragInstruction: string;
    placedLabel: string;
    pairs: {
      draggableItemId: string;
      targetId: string;
    }[];
  };
};
export type DragToTargetActivityDefinition = DragToTargetActivity;

export type CountAndSelectActivity = ActivityContent & {
  engineType: "count-and-select";
  config: {
    itemEmoji: string;
    itemLabel: string;
    displayCount: number;
    options: number[];
    targetCount: number;
  };
};

export type OrderingItem = ActivityItem & {
  size?: number;
};

export type OrderingActivity = ActivityContent & {
  engineType: "ordering";
  config: {
    items: OrderingItem[];
    correctOrder: string[];
    orderingInstruction: string;
  };
};
export type OrderingActivityDefinition = OrderingActivity;

export type PatternToken = {
  id: string;
  label: string;
  emoji?: string;
  color?: string;
};

export type PatternCompletionActivity = ActivityContent & {
  engineType: "pattern-completion";
  config: {
    sequence: PatternToken[];
    options: PatternToken[];
    targetOptionId: string;
    placeholder?: string;
    prompt?: string;
  };
};

export type RealWorldChallengeActivity = ActivityContent & {
  engineType: "real-world-challenge";
  config: {
    prompt: string;
    confirmationLabel: string;
    visual: {
      emoji: string;
      label: string;
      color?: string;
    };
  };
};

export type ActivityDefinition =
  | TapAndFindActivity
  | DragToTargetActivity
  | CountAndSelectActivity
  | OrderingActivity
  | PatternCompletionActivity
  | RealWorldChallengeActivity;

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
    /** The world that must be completed before this world is available. */
    prerequisiteWorldId?: string;
  };
  assets: {
    mapIcon: string;
    mapPrompt: string;
    entryLabel: string;
    introPrompt?: string;
  };
};

export type RewardDefinition = {
  id: string;
  icon: string;
  eyebrow: string;
  title: string;
  message: string;
  progressLockedIcon: string;
  completionLabel: string;
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