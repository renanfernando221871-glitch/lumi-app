import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LumiCharacter } from "../components/LumiCharacter";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  initialName: string;
  onBack: () => void;
  onContinue: (name: string, avatar: string) => void;
};

type Gender = "girl" | "boy" | "not-informed";

const roundedFont = Platform.select({
  ios: "Arial Rounded MT Bold",
  android: "sans-serif-rounded",
  web: "ui-rounded, Arial Rounded MT Bold, Trebuchet MS, sans-serif",
});

export function PersonalizeScreen({
  initialName,
  onBack,
  onContinue,
}: Props) {
  const [name, setName] = useState(initialName);
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState("");

  const formatBirthDate = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
    setBirthDate(parts.filter(Boolean).join("/"));
  };

  const continueOnboarding = () => {
    if (!name.trim()) {
      setError("Digite o nome da criança para continuar.");
      return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      setError("Digite a data no formato dia, mês e ano.");
      return;
    }
    setError("");
    onContinue(name.trim(), "🌻");
  };

  return (
    <Shell>
      <View style={styles.background}>
        <View style={[styles.cloud, styles.cloudLeft]} />
        <View style={[styles.cloud, styles.cloudRight]} />
        <View style={styles.hillBack} />
        <View style={styles.hillFront} />
        <View style={[styles.bush, styles.bushLeft]} />
        <View style={[styles.bush, styles.bushRight]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.top}>
          <View style={styles.back}>
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
          </View>

          <Image
            accessibilityLabel="Lumi — crescer é descobrir"
            resizeMode="contain"
            source={require("../../assets/images/lumi/lumi-logo-guardian.png")}
            style={styles.logo}
          />

          <View style={styles.lumiGreeting}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                Agora me conte sobre quem vai descobrir!
              </Text>
            </View>
            <LumiCharacter
              accessibilityLabel="Lumi, personagem oficial"
              expression="happy"
              size="large"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Perfil da criança</Text>
          <Text style={styles.description}>
            Vamos personalizar a experiência para ela aprender do seu jeito.
          </Text>

          <Text style={styles.avatarTitle}>Escolha um avatar</Text>
          <View style={styles.avatarWrap}>
            <Image
              accessibilityLabel="Avatar da criança"
              resizeMode="cover"
              source={require("../../assets/images/onboarding/child-avatar.png")}
              style={styles.avatar}
            />
            <View accessibilityLabel="Adicionar foto futuramente" style={styles.camera}>
              <View style={styles.cameraBody}>
                <View style={styles.cameraLens} />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Nome da criança</Text>
          <TextInput
            accessibilityLabel="Nome da criança"
            autoCapitalize="words"
            maxLength={24}
            onChangeText={setName}
            placeholder="Digite o nome da criança"
            placeholderTextColor="#8B96A3"
            style={styles.input}
            value={name}
          />

          <Text style={styles.label}>Data de nascimento</Text>
          <TextInput
            accessibilityLabel="Data de nascimento"
            inputMode="numeric"
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={formatBirthDate}
            placeholder="DD / MM / AAAA"
            placeholderTextColor="#8B96A3"
            style={styles.input}
            value={birthDate}
          />

          <Text style={styles.genderTitle}>Gênero (opcional)</Text>
          <View style={styles.genderOptions}>
            <GenderOption
              label="Menina"
              onPress={() => setGender("girl")}
              selected={gender === "girl"}
            />
            <GenderOption
              label="Menino"
              onPress={() => setGender("boy")}
              selected={gender === "boy"}
            />
            <GenderOption
              label="Prefiro não informar"
              onPress={() => setGender("not-informed")}
              selected={gender === "not-informed"}
              wide
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label="Continuar"
            onPress={continueOnboarding}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </Shell>
  );
}

function GenderOption({
  label,
  onPress,
  selected,
  wide = false,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
  wide?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.genderOption,
        wide && styles.genderOptionWide,
        selected && styles.genderSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <Text style={[styles.genderLabel, selected && styles.genderLabelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    overflow: "hidden",
    backgroundColor: "#DDF3FF",
  },
  cloud: {
    position: "absolute",
    width: 98,
    height: 48,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  cloudLeft: {
    left: "4%",
    top: "15%",
  },
  cloudRight: {
    right: "3%",
    top: "8%",
    transform: [{ scale: 0.72 }],
  },
  hillBack: {
    position: "absolute",
    width: "135%",
    height: "31%",
    left: "-38%",
    bottom: "-17%",
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
    transform: [{ rotate: "5deg" }],
  },
  hillFront: {
    position: "absolute",
    width: "135%",
    height: "29%",
    right: "-40%",
    bottom: "-17%",
    borderRadius: 999,
    backgroundColor: "#91D17A",
    transform: [{ rotate: "-5deg" }],
  },
  bush: {
    position: "absolute",
    bottom: "2%",
    width: 70,
    height: 48,
    borderRadius: 35,
    backgroundColor: "#68B968",
  },
  bushLeft: {
    left: "8%",
  },
  bushRight: {
    right: "8%",
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 70,
  },
  top: {
    width: "100%",
    maxWidth: 400,
    height: 225,
    alignItems: "center",
  },
  back: {
    position: "absolute",
    left: 0,
    top: 4,
    zIndex: 3,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  pressed: {
    opacity: 0.78,
  },
  backIcon: {
    color: "#1379C7",
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "600",
    marginTop: -3,
  },
  logo: {
    width: 185,
    height: 86,
  },
  lumiGreeting: {
    position: "absolute",
    right: -9,
    bottom: -25,
    flexDirection: "row",
    alignItems: "center",
  },
  speechBubble: {
    width: 188,
    minHeight: 78,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    ...shadow,
  },
  speechText: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "900",
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: colors.white,
    ...shadow,
  },
  title: {
    color: "#123C84",
    fontFamily: roundedFont,
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    maxWidth: 330,
    alignSelf: "center",
    color: "#334C78",
    fontSize: 16,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 3,
  },
  avatarTitle: {
    color: "#173D82",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 8,
  },
  avatarWrap: {
    width: 116,
    height: 116,
    alignSelf: "center",
    position: "relative",
    borderWidth: 5,
    borderColor: "#FFD6ED",
    borderRadius: 58,
    backgroundColor: "#FFE8F5",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 53,
  },
  camera: {
    position: "absolute",
    right: -7,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
    borderWidth: 3,
    borderColor: colors.white,
  },
  cameraBody: {
    width: 18,
    height: 13,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraLens: {
    width: 6,
    height: 6,
    borderWidth: 1.5,
    borderColor: colors.white,
    borderRadius: 3,
  },
  label: {
    color: "#173D82",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 13,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    minHeight: 54,
    borderWidth: 1.5,
    borderColor: "#D3DAE3",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FBFCFE",
    color: colors.ink,
    fontSize: 16,
  },
  genderTitle: {
    color: "#173D82",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 7,
  },
  genderOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genderOption: {
    minHeight: 39,
    borderWidth: 1.5,
    borderColor: "#D3DAE3",
    borderRadius: 14,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.white,
  },
  genderOptionWide: {
    flexGrow: 1,
  },
  genderSelected: {
    borderColor: colors.green,
    backgroundColor: "#EFFBEF",
  },
  radio: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: "#7F8E99",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.green,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  genderLabel: {
    color: "#435467",
    fontSize: 12,
    fontWeight: "600",
  },
  genderLabelSelected: {
    color: colors.deepGreen,
  },
  error: {
    color: "#B64B45",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },
  continueButton: {
    width: "100%",
    minHeight: 60,
    marginTop: 16,
  },
});