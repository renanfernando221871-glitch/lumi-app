import React, { useEffect, useRef, useState } from "react";
import { activities } from "./src/data/activities";
import { getRewardById, rewards } from "./src/data/rewards";
import { worldCatalog } from "./src/data/worlds";
import {
  canOpenWorld,
  canStartWorldActivity,
  completeWorldActivityTransition,
  getNextIncompleteActivityId,
  getUnlockedWorldIds,
} from "./src/domain/progress";
import { persistProgressBeforeCommit } from "./src/domain/progressPersistence";
import { useAppNavigation } from "./src/navigation/useAppNavigation";
import { ActivityScreen } from "./src/screens/ActivityScreen";
import { HouseScreen } from "./src/screens/HouseScreen";
import { GuardianSignupScreen } from "./src/screens/GuardianSignupScreen";
import { SafetyScreen } from "./src/screens/SafetyScreen";
import { GuardianHomeScreen } from "./src/screens/GuardianHomeScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { PersonalizeScreen } from "./src/screens/PersonalizeScreen";
import { RewardScreen } from "./src/screens/RewardScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import {
  defaultProfile,
  defaultProgress,
  loadSavedState,
  saveProfile,
  saveProgress,
} from "./src/storage/progress";
import {
  ActivityDefinition,
  ChildProfile,
  ProgressState,
  WorldDefinition,
} from "./src/types";
import {
  EngineFixtureHarness,
  getRequestedEngineFixture,
} from "./src/testing/EngineFixtureHarness";

function getWorld(worldId: string): WorldDefinition {
  const world = worldCatalog.find((candidate) => candidate.id === worldId);
  if (!world) throw new Error(`[Lumi navigation] Unknown world "${worldId}".`);
  return world;
}

function getWorldActivities(world: WorldDefinition): ActivityDefinition[] {
  return world.activityIds.map((activityId) => {
    const activity = activities.find((candidate) => candidate.id === activityId);
    if (!activity) {
      throw new Error(`[Lumi navigation] Unknown activity "${activityId}".`);
    }
    return activity;
  });
}

function getActivity(
  worldActivities: ActivityDefinition[],
  activityId: string,
): ActivityDefinition {
  const activity = worldActivities.find((candidate) => candidate.id === activityId);
  if (!activity) {
    throw new Error(`[Lumi navigation] Activity "${activityId}" is not in this world.`);
  }
  return activity;
}

export default function App() {
  const engineFixture = getRequestedEngineFixture();
  if (engineFixture) return <EngineFixtureHarness activity={engineFixture} />;
  return <LumiApp />;
}

function LumiApp() {
  const navigation = useAppNavigation();
  const { replace } = navigation;
  const [profile, setProfile] = useState<ChildProfile>(defaultProfile);
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const progressRef = useRef<ProgressState>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadSavedState().then(({ profile: savedProfile, progress: savedProgress }) => {
      if (!mounted) return;
      setProfile(savedProfile);
      progressRef.current = savedProgress;
      setProgress(savedProgress);
      setHydrated(true);
      replace("welcome");
    });
    return () => {
      mounted = false;
    };
  }, [replace]);

  const updateProfile = (name: string, avatar: string) => {
    const next = { name, avatar, hasOnboarded: true };
    setProfile(next);
    saveProfile(next).catch(console.error);
    navigation.replace("safety");
  };

  if (!hydrated || navigation.route === "splash") {
    return (
      <WelcomeScreen
        disabled={!hydrated}
        onContinue={() => navigation.replace("guardian")}
      />
    );
  }

  if (navigation.route === "welcome") {
    return <WelcomeScreen onContinue={() => navigation.replace("guardian")} />;
  }

  if (navigation.route === "guardian") {
    return (
      <GuardianSignupScreen
        onBack={navigation.goBack}
        onContinue={() => navigation.replace("personalize")}
      />
    );
  }

  if (navigation.route === "personalize") {
    return (
      <PersonalizeScreen
        initialName={profile.name}
        onBack={navigation.goBack}
        onContinue={updateProfile}
      />
    );
  }

  if (navigation.route === "safety") {
    return (
      <SafetyScreen
        onBack={navigation.goBack}
        onContinue={() => navigation.replace("guardianHome")}
      />
    );
  }

  if (navigation.route === "guardianHome") {
    return (
      <GuardianHomeScreen
        childName={profile.name}
        completedActivities={progress.completedActivityIds.length}
        totalActivities={worldCatalog.reduce(
          (total, world) => total + world.activityIds.length,
          0,
        )}
        onOpenActivities={() => navigation.replace("map")}
      />
    );
  }

  if (navigation.route === "map") {
    const unlockedWorldIds = getUnlockedWorldIds(
      worldCatalog,
      progress.completedActivityIds,
    );
    const rewardCatalog = rewards.reduce<Record<string, (typeof rewards)[number]>>(
      (result, reward) => {
        result[reward.id] = reward;
        return result;
      },
      {},
    );
    return (
      <MapScreen
        profile={profile}
        worlds={worldCatalog}
        unlockedWorldIds={unlockedWorldIds}
        completedActivityIds={progress.completedActivityIds}
        rewards={rewardCatalog}
        onOpenWorld={(worldId) => {
          if (unlockedWorldIds.includes(worldId)) navigation.openWorld(worldId);
        }}
        onEditProfile={() => navigation.replace("personalize")}
      />
    );
  }

  const world = getWorld(navigation.worldId);
  if (!canOpenWorld(world, progress, worldCatalog)) {
    return (
      <NavigationRedirect
        onRedirect={() => navigation.replace("map")}
      />
    );
  }
  const worldActivities = getWorldActivities(world);
  const worldNumber = worldCatalog.indexOf(world) + 1;

  if (navigation.route === "house") {
    const startActivities = () => {
      const next =
        getNextIncompleteActivityId(world, progress.completedActivityIds) ??
        worldActivities[0].id;
      navigation.startActivity(world.id, next);
    };
    return (
      <HouseScreen
        completedActivityIds={progress.completedActivityIds}
        world={world}
        worldNumber={worldNumber}
        activities={worldActivities}
        onBack={navigation.goBack}
        onStart={startActivities}
      />
    );
  }

  const activity = getActivity(worldActivities, navigation.activityId);
  if (
    !canStartWorldActivity(
      world,
      activity.id,
      progress,
      worldCatalog,
    )
  ) {
    const expectedActivityId = getNextIncompleteActivityId(
      world,
      progress.completedActivityIds,
    );
    return (
      <NavigationRedirect
        onRedirect={() =>
          expectedActivityId
            ? navigation.startActivity(world.id, expectedActivityId)
            : navigation.replace("map")
        }
      />
    );
  }
  const activityIndex = worldActivities.indexOf(activity);

  const completeActivity = async () => {
    const transition = completeWorldActivityTransition(
      progressRef.current,
      world,
      activity.id,
    );
    const { destination } = transition;
    if (transition.progressChanged) {
      try {
        await persistProgressBeforeCommit(
          transition.progress,
          saveProgress,
          (persistedProgress) => {
            progressRef.current = persistedProgress;
            setProgress(persistedProgress);
          },
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    if (destination.type === "activity") {
      navigation.startActivity(world.id, destination.activityId);
    } else if (destination.type === "reward") {
      navigation.showReward(destination.rewardId);
    } else {
      navigation.replace("map");
    }
  };

  return (
    <>
      <ActivityScreen
        key={activity.id}
        activity={activity}
        activityNumber={activityIndex + 1}
        total={worldActivities.length}
        finalCompletionLabel={getRewardById(world.rewardId).completionLabel}
        onBack={navigation.goBack}
        onComplete={completeActivity}
      />
      {navigation.rewardId ? (
        <RewardScreen
          reward={getRewardById(navigation.rewardId)}
          onClose={() => navigation.replace("map")}
        />
      ) : null}
    </>
  );
}

function NavigationRedirect({ onRedirect }: { onRedirect: () => void }) {
  useEffect(() => {
    onRedirect();
  }, [onRedirect]);
  return (
    <WelcomeScreen disabled onContinue={() => undefined} />
  );
}