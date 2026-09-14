import React, { useEffect, useState } from "react";
import { activities } from "./src/data/activities";
import { getRewardById } from "./src/data/rewards";
import { casaDoLumi, worldCatalog } from "./src/data/worlds";
import {
  completeWorldProgress,
  getWorldCompletionDestination,
} from "./src/domain/progress";
import { useAppNavigation } from "./src/navigation/useAppNavigation";
import { ActivityScreen } from "./src/screens/ActivityScreen";
import { HouseScreen } from "./src/screens/HouseScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { PersonalizeScreen } from "./src/screens/PersonalizeScreen";
import { RewardScreen } from "./src/screens/RewardScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadSavedState().then(({ profile: savedProfile, progress: savedProgress }) => {
      if (!mounted) return;
      setProfile(savedProfile);
      setProgress(savedProgress);
      setHydrated(true);
      setTimeout(() => {
        if (mounted) replace(savedProfile.hasOnboarded ? "map" : "welcome");
      }, 850);
    });
    return () => {
      mounted = false;
    };
  }, [replace]);

  const updateProfile = (name: string, avatar: string) => {
    const next = { name, avatar, hasOnboarded: true };
    setProfile(next);
    saveProfile(next).catch(console.error);
    navigation.replace("map");
  };

  if (!hydrated || navigation.route === "splash") return <SplashScreen />;

  if (navigation.route === "welcome") {
    return <WelcomeScreen onContinue={() => navigation.replace("personalize")} />;
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

  if (navigation.route === "map") {
    const reward = getRewardById(casaDoLumi.rewardId);
    const completedCount = casaDoLumi.activityIds.filter((id) =>
      progress.completedActivityIds.includes(id),
    ).length;
    return (
      <MapScreen
        profile={profile}
        world={casaDoLumi}
        reward={reward}
        worldNumber={worldCatalog.indexOf(casaDoLumi) + 1}
        completedCount={completedCount}
        hasFlower={progress.earnedRewardIds.includes(casaDoLumi.rewardId)}
        onOpenHouse={() => navigation.openWorld(casaDoLumi.id)}
        onEditProfile={() => navigation.replace("personalize")}
      />
    );
  }

  const world = getWorld(navigation.worldId);
  const worldActivities = getWorldActivities(world);
  const worldNumber = worldCatalog.indexOf(world) + 1;

  if (navigation.route === "house") {
    const startActivities = () => {
      const next =
        worldActivities.find(
          (activity) => !progress.completedActivityIds.includes(activity.id),
        ) ?? worldActivities[0];
      navigation.startActivity(world.id, next.id);
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
  const activityIndex = worldActivities.indexOf(activity);

  const completeActivity = () => {
    const { progress: nextProgress, rewardGranted } = completeWorldProgress(
      progress,
      activity.id,
      world,
    );
    setProgress(nextProgress);
    saveProgress(nextProgress).catch(console.error);

    const destination = getWorldCompletionDestination(
      rewardGranted,
      activity.id,
      world,
    );
    if (destination === "reward") {
      navigation.showReward(world.rewardId);
    } else if (destination === "next") {
      navigation.startActivity(world.id, worldActivities[activityIndex + 1].id);
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