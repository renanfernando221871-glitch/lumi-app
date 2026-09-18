import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { useFonts } from "expo-font";
import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { worldCatalog } from "./src/data/worlds";
import { getUnlockedWorldIds } from "./src/domain/progress";
import { useAppNavigation } from "./src/navigation/useAppNavigation";
import { GuardianSignupScreen } from "./src/screens/GuardianSignupScreen";
import { SafetyScreen } from "./src/screens/SafetyScreen";
import { GuardianHomeScreen } from "./src/screens/GuardianHomeScreen";
import { ChildIntroScreen } from "./src/screens/ChildIntroScreen";
import { FarmDiscoveriesScreen } from "./src/screens/FarmDiscoveriesScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { PersonalizeScreen } from "./src/screens/PersonalizeScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import {
  defaultProfile,
  defaultProgress,
  loadSavedState,
  saveProfile,
} from "./src/storage/progress";
import { ChildProfile, ProgressState } from "./src/types";

export default function App() {
  return <LumiApp />;
}

function LumiApp() {
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
  });
  const navigation = useAppNavigation();
  const { replace } = navigation;
  const [profile, setProfile] = useState<ChildProfile>(defaultProfile);
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadSavedState()
      .then(({ profile: savedProfile, progress: savedProgress }) => {
        if (!mounted) return;
        setProfile(savedProfile);
        setProgress(savedProgress);
        setHydrated(true);
        replace("welcome");
      })
      .catch((error) => {
        console.error("[Lumi preview] Não foi possível preparar o progresso.", error);
        if (mounted) setHydrated(true);
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

  const showComingSoon = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.alert("Novas aventuras em breve!");
      return;
    }
    Alert.alert("Novas aventuras em breve!");
  };

  const openWorld = (worldId: string) => {
    if (worldId === "fazenda-das-descobertas") {
      navigation.replace("farmDiscoveries");
      return;
    }
    showComingSoon();
  };

  if (!fontsLoaded || !hydrated || navigation.route === "splash") {
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
        onOpenChildMode={() => navigation.replace("childIntro")}
        onOpenActivities={() => navigation.replace("map")}
      />
    );
  }

  if (navigation.route === "childIntro") {
    return (
      <ChildIntroScreen
        childName={profile.name}
        onBack={navigation.goBack}
        onContinue={() => navigation.replace("map")}
      />
    );
  }

  if (navigation.route === "map") {
    const unlockedWorldIds = getUnlockedWorldIds(
      worldCatalog,
      progress.completedActivityIds,
    );
    return (
      <MapScreen
        profile={profile}
        worlds={worldCatalog}
        unlockedWorldIds={unlockedWorldIds}
        completedActivityIds={progress.completedActivityIds}
        onOpenWorld={openWorld}
        onEditProfile={() => navigation.replace("personalize")}
      />
    );
  }

  if (navigation.route === "farmDiscoveries") {
    return (
      <FarmDiscoveriesScreen
        onBack={() => navigation.replace("map")}
        onOpenSettings={() => navigation.replace("personalize")}
      />
    );
  }

  return <WelcomeScreen disabled onContinue={() => undefined} />;
}