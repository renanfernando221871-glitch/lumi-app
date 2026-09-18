import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { LeluaLogo } from "../components/LeluaLogo";
import { LumiCharacter } from "../components/LumiCharacter";
import { ChildProfile, WorldDefinition } from "../types";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  profile: ChildProfile;
  worlds: readonly WorldDefinition[];
  unlockedWorldIds: readonly string[];
  completedActivityIds: readonly string[];
  onOpenWorld: (worldId: string) => void;
  onEditProfile: () => void;
};

type WorldPosition = {
  left: `${number}%`;
  top: `${number}%`;
  width: `${number}%`;
  height: `${number}%`;
};

type NavItemProps = {
  active?: boolean;
  icon?: string;
  iconSource?: ImageSourcePropType;
  label: string;
  onPress?: () => void;
};

const roundedFont = "Fredoka_700Bold";
const bodyMediumFont = "Nunito_500Medium";

const worldPositions: Record<string, WorldPosition> = {
  "fazenda-das-descobertas": {
    left: "1%",
    top: "20%",
    width: "40%",
    height: "22%",
  },
  "parque-das-cores": {
    left: "59%",
    top: "20%",
    width: "40%",
    height: "22%",
  },
  "casa-do-lumi": {
    left: "29%",
    top: "41%",
    width: "42%",
    height: "23%",
  },
  "mercado-do-lumi": {
    left: "0%",
    top: "62%",
    width: "42%",
    height: "22%",
  },
  "cidade-das-aventuras": {
    left: "59%",
    top: "64%",
    width: "41%",
    height: "22%",
  },
};

const worldLabels: Record<string, string> = {
  "fazenda-das-descobertas": "Fazenda",
  "parque-das-cores": "Parque",
  "casa-do-lumi": "Casa",
  "mercado-do-lumi": "Mercado",
  "cidade-das-aventuras": "Cidade",
};

export function MapScreen({
  profile,
  worlds,
  unlockedWorldIds,
  completedActivityIds,
  onOpenWorld,
  onEditProfile,
}: Props) {
  const { height } = useWindowDimensions();

  return (
    <Shell>
      <View style={[styles.screen, { height }]}>
        <View style={styles.map}>
          <Image
            accessibilityLabel="Mapa ilustrado de aventuras da Leluá"
            resizeMode="stretch"
            source={require("../../assets/images/world-map-lelua-base.png")}
            style={styles.mapImage}
          />
          {worlds.map((world) => {
            const position = worldPositions[world.id];
            if (!position) return null;

            const label = worldLabels[world.id] ?? world.title;
            const unlocked = unlockedWorldIds.includes(world.id);
            const completed = world.activityIds.every((activityId) =>
              completedActivityIds.includes(activityId),
            );
            const state = completed
              ? "concluído"
              : unlocked
                ? "disponível"
                : "bloqueado";

            return (
              <Pressable
                accessibilityHint={
                  unlocked
                    ? `Abre o mundo ${label}`
                    : "Conclua o mundo anterior para desbloquear"
                }
                accessibilityLabel={`${label}, ${state}`}
                accessibilityRole="button"
                accessibilityState={{ disabled: !unlocked }}
                key={world.id}
                onPress={unlocked ? () => onOpenWorld(world.id) : undefined}
                style={({ pressed }) => [
                  styles.worldDestination,
                  position,
                  pressed && unlocked && styles.pressed,
                ]}
              >
                <View style={styles.worldLabel}>
                  <Text numberOfLines={1} style={styles.worldLabelText}>
                    {label}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    completed && styles.completedBadge,
                    unlocked && !completed && styles.availableBadge,
                  ]}
                >
                  {completed ? (
                    <Text style={styles.completedIcon}>✓</Text>
                  ) : unlocked ? (
                    <Text style={styles.availableIcon}>★</Text>
                  ) : (
                    <View style={styles.lockIcon}>
                      <View style={styles.lockShackle} />
                      <View style={styles.lockBody} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}

          <View style={styles.lowerSign}>
            <Text style={styles.lowerSignText}>Explorar{"\n"}Aprender{"\n"}Crescer</Text>
            <Text style={styles.lowerSignHeart}>♥</Text>
          </View>

          <View pointerEvents="none" style={styles.messageSign}>
            <Text style={styles.messageSignText}>
              Pequenas descobertas,{"\n"}um grande amanhã!
            </Text>
            <Text style={styles.messageSignHeart}>♥</Text>
          </View>
        </View>

        <View pointerEvents="none" style={styles.headerWash} />
        <View style={styles.header}>
          <LeluaLogo compact style={styles.logo} />
          <Pressable
            accessibilityLabel="Configurações do perfil"
            accessibilityRole="button"
            onPress={onEditProfile}
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.pressed,
            ]}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/images/onboarding/guardian-home/settings-framed.png")}
              style={styles.settingsIcon}
            />
          </Pressable>
        </View>

        <View pointerEvents="none" style={styles.intro}>
          <LumiCharacter
            accessibilityLabel="Leluá convidando para uma aventura"
            expression="main"
            size="large"
            style={styles.character}
          />
          <View style={styles.introCopy}>
            <Text style={styles.title}>Qual aventura{"\n"}vamos explorar hoje?</Text>
            <Text style={styles.subtitle}>
              Escolha um mundo e descubra coisas incríveis!
            </Text>
          </View>
        </View>

        <View style={styles.bottomNav}>
          <NavItem active icon="⌂" label="Início" />
          <NavItem
            iconSource={require("../../assets/images/onboarding/guardian-home/reports.png")}
            label="Relatórios"
          />
          <NavItem
            iconSource={require("../../assets/images/onboarding/guardian-home/star-framed.png")}
            label="Conquistas"
          />
          <NavItem
            iconSource={
              profile.avatar === "boy"
                ? require("../../assets/images/onboarding/boy-avatar.png")
                : require("../../assets/images/onboarding/girl-avatar.png")
            }
            label="Perfil"
            onPress={onEditProfile}
          />
        </View>
      </View>
    </Shell>
  );
}

function NavItem({
  active = false,
  icon,
  iconSource,
  label,
  onPress,
}: NavItemProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        active && styles.navItemActive,
        pressed && styles.pressed,
      ]}
    >
      {iconSource ? (
        <Image resizeMode="contain" source={iconSource} style={styles.navIconImage} />
      ) : (
        <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
      )}
      <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#C9F2FF",
  },
  map: {
    position: "absolute",
    top: 182,
    right: 0,
    bottom: 72,
    left: 0,
    overflow: "hidden",
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  headerWash: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 205,
    backgroundColor: "rgba(213, 246, 255, 0.84)",
  },
  header: {
    position: "absolute",
    top: 26,
    right: 20,
    left: 20,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 168,
    height: 74,
  },
  settingsButton: {
    position: "absolute",
    right: 0,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  settingsIcon: {
    width: 38,
    height: 38,
    flexShrink: 0,
  },
  intro: {
    position: "absolute",
    top: 92,
    right: 18,
    left: 18,
    height: 145,
    flexDirection: "row",
    alignItems: "center",
  },
  character: {
    width: 130,
    height: 145,
  },
  introCopy: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 6,
  },
  title: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: "700",
  },
  subtitle: {
    color: "#405473",
    fontFamily: bodyMediumFont,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "500",
    marginTop: 5,
  },
  messageSign: {
    position: "absolute",
    top: 52,
    right: 52,
    width: 126,
    minHeight: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: "#B9793F",
    borderWidth: 3,
    borderColor: "#8F562E",
    transform: [{ rotate: "3deg" }],
    ...shadow,
  },
  messageSignText: {
    color: "#4D2C1D",
    fontFamily: bodyMediumFont,
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  messageSignHeart: {
    color: "#8A342A",
    fontSize: 12,
    lineHeight: 13,
  },
  worldDestination: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 2,
  },
  worldLabel: {
    minWidth: 86,
    minHeight: 31,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...shadow,
  },
  worldLabelText: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "700",
    textAlign: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 2,
    right: 7,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderWidth: 2,
    borderColor: "rgba(18,60,132,0.18)",
    ...shadow,
  },
  availableBadge: {
    borderColor: "#63C76A",
  },
  completedBadge: {
    borderColor: colors.white,
    backgroundColor: "#53B94A",
  },
  completedIcon: {
    color: colors.white,
    fontFamily: roundedFont,
    fontSize: 23,
    lineHeight: 26,
    fontWeight: "700",
  },
  availableIcon: {
    color: "#F4B72E",
    fontSize: 21,
    lineHeight: 24,
  },
  lockIcon: {
    width: 18,
    height: 22,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lockShackle: {
    position: "absolute",
    top: 0,
    width: 13,
    height: 13,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderColor: "#123C84",
  },
  lockBody: {
    width: 18,
    height: 13,
    borderRadius: 3,
    backgroundColor: "#123C84",
  },
  lowerSign: {
    position: "absolute",
    left: 10,
    bottom: 8,
    width: 84,
    minHeight: 58,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B9793F",
    borderWidth: 3,
    borderColor: "#8F562E",
    transform: [{ rotate: "-4deg" }],
  },
  lowerSignText: {
    color: "#4D2C1D",
    fontFamily: bodyMediumFont,
    fontSize: 10.5,
    lineHeight: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  lowerSignHeart: {
    position: "absolute",
    right: 8,
    bottom: 4,
    color: "#8A342A",
    fontSize: 9,
  },
  bottomNav: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    minHeight: 78,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 5,
    backgroundColor: colors.white,
    ...shadow,
  },
  navItem: {
    flex: 1,
    minHeight: 60,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemActive: {
    backgroundColor: "#E4F4FF",
  },
  navIcon: {
    height: 27,
    color: "#7C8EA6",
    fontSize: 27,
    lineHeight: 28,
  },
  navIconImage: {
    width: 28,
    height: 28,
    flexShrink: 0,
  },
  navLabel: {
    color: "#6F8097",
    fontFamily: bodyMediumFont,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  navActive: {
    color: "#238CE3",
    fontFamily: roundedFont,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.74,
  },
});