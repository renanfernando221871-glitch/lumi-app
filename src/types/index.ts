export type ActivityEngineType =
  | "tap-and-find"
  | "drag-to-target"
  | "count-and-select"
  | "ordering"
  | "pattern-completion"
  | "real-world-challenge"
  | "classification"
  | "visual-memory";

export type ActivityItem = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  /** Optional text glyph whose fill color comes from `color`. */
  colorGlyph?: string;
  /** Optional headwear rendered above a character without changing its identity. */
  headwearEmoji?: string;
  /** Optional single-component character visual for roles without a clear emoji. */
  characterVisual?: "driver";
  /** Optional drawn visual for items whose emoji is not reliably supported. */
  itemVisual?: "potted-plant";
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
  /** Optional shorter phrase spoken by the instruction audio button. */
  audioText?: string;
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
    presentation?: "grid" | "color-options" | "sound-options";
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

export type ClassificationActivity = ActivityContent & {
  engineType: "classification";
  config: {
    categories: { id: string; label: string; emoji: string; color: string }[];
    items: ActivityItem[];
    assignments: { itemId: string; categoryId: string }[];
  };
};

export type VisualMemoryActivity = ActivityContent & {
  engineType: "visual-memory";
  config: {
    items: ActivityItem[];
    missingItemId: string;
    revealDurationMs?: number;
    studyPrompt?: string;
    questionPrompt?: string;
  };
};

export type ActivityDefinition =
  | TapAndFindActivity
  | DragToTargetActivity
  | CountAndSelectActivity
  | OrderingActivity
  | PatternCompletionActivity
  | RealWorldChallengeActivity
  | ClassificationActivity
  | VisualMemoryActivity;

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