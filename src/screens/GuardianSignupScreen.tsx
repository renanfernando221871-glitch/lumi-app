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
  onBack: () => void;
  onContinue: () => void;
};

const roundedFont = Platform.select({
  ios: "Arial Rounded MT Bold",
  android: "sans-serif-rounded",
  web: "ui-rounded, Arial Rounded MT Bold, Trebuchet MS, sans-serif",
});

export function GuardianSignupScreen({ onBack, onContinue }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const continueLocally = () => {
    if (!name.trim()) {
      setError("Digite seu nome para continuar.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Digite um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setError("");
    onContinue();
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
                pressed && styles.backButtonPressed,
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
              <Text style={styles.speechText}>Vamos{"\n"}começar?</Text>
            </View>
            <LumiCharacter
              accessibilityLabel="Lumi, personagem oficial"
              expression="main"
              size="large"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.description}>
            É rápido e simples. Assim podemos acompanhar essa jornada juntos.
          </Text>

          <SignupField
            autoCapitalize="words"
            icon="○"
            label="Nome"
            onChangeText={setName}
            value={name}
          />
          <SignupField
            autoCapitalize="none"
            icon="@"
            keyboardType="email-address"
            label="E-mail"
            onChangeText={setEmail}
            value={email}
          />
          <View style={styles.passwordWrap}>
            <SignupField
              autoCapitalize="none"
              icon="□"
              label="Senha"
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              value={password}
            />
            <Pressable
              accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
              accessibilityRole="button"
              onPress={() => setShowPassword((visible) => !visible)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "◉" : "◎"}</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label="Continuar"
            onPress={continueLocally}
            style={styles.continueButton}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.divider} />
          </View>

          <SocialButton
            brand="google"
            label="Continuar com Google"
            onPress={onContinue}
          />
          <SocialButton
            brand="apple"
            label="Continuar com Apple"
            onPress={onContinue}
          />

          <View style={styles.securityRow}>
            <Text style={styles.securityIcon}>▢</Text>
            <Text style={styles.securityText}>
              Seus dados estão seguros com a gente.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Shell>
  );
}

type SignupFieldProps = React.ComponentProps<typeof TextInput> & {
  icon: string;
  label: string;
};

function SignupField({ icon, label, ...props }: SignupFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldIcon}>{icon}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholder={label}
        placeholderTextColor="#71808D"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

function SocialButton({
  brand,
  label,
  onPress,
}: {
  brand: "google" | "apple";
  label: string;
  onPress: () => void;
}) {
  const iconSource =
    brand === "google"
      ? require("../../assets/icons/google.png")
      : require("../../assets/icons/apple.png");

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.socialButton,
        pressed && styles.socialPressed,
      ]}
    >
      <View style={styles.socialIconSlot}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={iconSource}
          style={[
            styles.socialIcon,
            brand === "apple" && styles.appleIcon,
          ]}
        />
      </View>
      <Text style={styles.socialLabel}>{label}</Text>
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
    width: 92,
    height: 48,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  cloudLeft: {
    left: "11%",
    top: "14%",
  },
  cloudRight: {
    right: "8%",
    top: "9%",
    transform: [{ scale: 0.7 }],
  },
  hillBack: {
    position: "absolute",
    width: "125%",
    height: "28%",
    left: "-35%",
    bottom: "-16%",
    borderRadius: 999,
    backgroundColor: "#BFE8A8",
    transform: [{ rotate: "4deg" }],
  },
  hillFront: {
    position: "absolute",
    width: "130%",
    height: "27%",
    right: "-38%",
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
    height: 215,
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
  backButtonPressed: {
    opacity: 0.78,
  },
  backIcon: {
    color: colors.deepGreen,
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "500",
    marginTop: -3,
  },
  logo: {
    width: 185,
    height: 86,
  },
  lumiGreeting: {
    position: "absolute",
    right: -8,
    bottom: -25,
    flexDirection: "row",
    alignItems: "center",
  },
  speechBubble: {
    width: 116,
    minHeight: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  speechText: {
    color: colors.deepGreen,
    fontFamily: roundedFont,
    fontSize: 17,
    lineHeight: 20,
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
    color: colors.deepGreen,
    fontFamily: roundedFont,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    maxWidth: 320,
    alignSelf: "center",
    color: "#435D68",
    fontSize: 16,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 18,
  },
  field: {
    minHeight: 58,
    borderWidth: 1.5,
    borderColor: "#D4DEE5",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    backgroundColor: "#FAFCFD",
  },
  fieldIcon: {
    width: 30,
    color: "#587181",
    fontSize: 23,
    textAlign: "center",
  },
  input: {
    flex: 1,
    minHeight: 55,
    paddingHorizontal: 12,
    color: colors.ink,
    fontSize: 16,
  },
  passwordWrap: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 18,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIcon: {
    color: "#587181",
    fontSize: 25,
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9E2E7",
  },
  dividerText: {
    color: "#60737E",
    fontSize: 14,
  },
  socialButton: {
    minHeight: 55,
    borderWidth: 1.5,
    borderColor: "#D4DEE5",
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
    backgroundColor: colors.white,
  },
  socialPressed: {
    backgroundColor: "#F4F8FA",
  },
  socialIconSlot: {
    width: 42,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  appleIcon: {
    width: 23,
    height: 23,
  },
  socialLabel: {
    minWidth: 200,
    color: "#18252B",
    fontSize: 16,
    fontWeight: "600",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  securityIcon: {
    color: "#587181",
    fontSize: 16,
  },
  securityText: {
    color: "#526772",
    fontSize: 12,
  },
});