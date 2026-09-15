import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { ChildProfile, RewardDefinition, WorldDefinition } from "../types";
import { Shell } from "./components/Shell";

type Props = {
  profile: ChildProfile;
  worlds: readonly WorldDefinition[];
  unlockedWorldIds: readonly string[];
  completedActivityIds: readonly string[];
  rewards: Readonly<Record<string, RewardDefinition>>;
  onOpenWorld: (worldId: string) => void;
  onEditProfile: () => void;
};

type WorldPosition = {
  left: `${number}%`;
  top: `${number}%`;
  width: `${number}%`;
  height: `${number}%`;
};

const worldPositions: Record<string, WorldPosition> = {
  "fazenda-das-descobertas": { left: "7%", top: "35%", width: "39%", height: "17%" },
  "parque-das-cores": { left: "58%", top: "35%", width: "38%", height: "17%" },
  "casa-do-lumi": { left: "29%", top: "48%", width: "43%", height: "17%" },
  "mercado-do-lumi": { left: "3%", top: "61%", width: "43%", height: "17%" },
  "cidade-das-aventuras": { left: "55%", top: "63%", width: "42%", height: "17%" },
};

export function MapScreen({
  profile: _profile,
  worlds,
  unlockedWorldIds,
  completedActivityIds,
  rewards: _rewards,
  onOpenWorld,
  onEditProfile,
}: Props) {
  const { height } = useWindowDimensions();

  return (
    <Shell>
      <View style={[styles.screen, { minHeight: height }]}>
        <ImageBackground
          accessibilityLabel="Mapa mágico de aventuras da Lumi"
          resizeMode="stretch"
          source={require("../../assets/images/world-map-official.png")}
          style={[styles.map, { height }]}
        >
          <Pressable
            accessibilityLabel="Configurações do perfil"
            onPress={onEditProfile}
            style={styles.settingsHotspot}
          />

          {worlds.map((world) => {
            const position = worldPositions[world.id];
            if (!position) return null;

            const unlocked = unlockedWorldIds.includes(world.id);
            const completed = world.activityIds.every((activityId) =>
              completedActivityIds.includes(activityId),
            );
            return (
              <Pressable
                accessibilityLabel={`${world.title}${
                  completed ? ", concluído" : unlocked ? "" : ", bloqueado"
                }`}
                accessibilityRole="button"
                accessibilityState={{ disabled: !unlocked }}
                disabled={!unlocked}
                key={world.id}
                onPress={() => onOpenWorld(world.id)}
                style={[styles.worldHotspot, position]}
              >
                {!unlocked ? (
                  <>
                    <View style={styles.lockedOverlay} />
                    <View style={styles.statusBadge}>
                      <Text style={styles.lockIcon}>🔒</Text>
                    </View>
                  </>
                ) : completed ? (
                  <View
                    accessibilityLabel="Mundo concluído"
                    style={[styles.statusBadge, styles.completedBadge]}
                  >
                    <Text style={styles.completedIcon}>✓</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}

          <Pressable
            accessibilityLabel="Editar perfil"
            onPress={onEditProfile}
            style={styles.profileHotspot}
          />
        </ImageBackground>
      </View>
    </Shell>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#BCEFFF",
  },
  map: {
    width: "100%",
  },
  worldHotspot: {
    position: "absolute",
    borderRadius: 36,
    overflow: "hidden",
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    backgroundColor: "rgba(72, 92, 102, 0.18)",
    pointerEvents: "none",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderWidth: 2,
    borderColor: "rgba(78, 98, 105, 0.25)",
    pointerEvents: "none",
  },
  lockIcon: {
    fontSize: 20,
  },
  completedBadge: {
    backgroundColor: "#53B94A",
    borderColor: "rgba(255, 255, 255, 0.92)",
  },
  completedIcon: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  settingsHotspot: {
    position: "absolute",
    top: "5%",
    right: "3%",
    width: "15%",
    height: "8%",
    borderRadius: 40,
  },
  profileHotspot: {
    position: "absolute",
    right: "3%",
    bottom: "1.5%",
    width: "18%",
    height: "8%",
    borderRadius: 30,
  },
});