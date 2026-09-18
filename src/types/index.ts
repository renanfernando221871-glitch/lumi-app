export type WorldDefinition = {
  id: string;
  title: string;
  description: string;
  activityIds: string[];
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