import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

type Props = {
  onBack: () => void;
  onOpenSettings: () => void;
  onStartActivity: () => void;
};

export function FarmDiscoveriesScreen({
  onBack,
  onOpenSettings,
  onStartActivity,
}: Props) {
  const { height, width: viewportWidth } = useWindowDimensions();
  const screenWidth = Math.min(520, viewportWidth);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <View
        style={[
          styles.screen,
          { width: screenWidth, height },
        ]}
      >
        <ImageBackground
          accessibilityLabel="Descobertas da Fazenda, com oito atividades"
          resizeMode="cover"
          source={require("../../assets/images/farm-discoveries-approved.png")}
          style={styles.artwork}
        >
          <Pressable
            accessibilityLabel="Voltar ao mapa"
            accessibilityRole="button"
            hitSlop={12}
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          />

          <Pressable
            accessibilityLabel="Configurações"
            accessibilityRole="button"
            hitSlop={12}
            onPress={onOpenSettings}
            style={({ pressed }) => [
              styles.settingsButton,
              pressed && styles.pressed,
            ]}
          />

          <Pressable
            accessibilityHint="Abre a primeira atividade disponível da Fazenda"
            accessibilityLabel="Começar atividade"
            accessibilityRole="button"
            onPress={onStartActivity}
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.pressed,
            ]}
          />

          <Pressable
            accessibilityLabel="Quem faz muuu?"
            accessibilityRole="button"
            onPress={onStartActivity}
            style={({ pressed }) => [
              styles.firstActivityButton,
              pressed && styles.pressed,
            ]}
          />
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },
  screen: {
    maxWidth: 520,
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "#111827",
  },
  artwork: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: "3.1%",
    left: "4.5%",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  settingsButton: {
    position: "absolute",
    top: "3.1%",
    right: "4.5%",
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  startButton: {
    position: "absolute",
    right: "7%",
    bottom: "3.6%",
    left: "7%",
    height: "7.3%",
    borderRadius: 32,
  },
  firstActivityButton: {
    position: "absolute",
    top: "37.2%",
    right: "7%",
    left: "7%",
    height: "5.8%",
    borderRadius: 24,
  },
  pressed: {
    opacity: 0.72,
  },
});
