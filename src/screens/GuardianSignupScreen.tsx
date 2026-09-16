import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LumiCharacter } from "../components/LumiCharacter";
import { LeluaLogo } from "../components/LeluaLogo";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, shadow } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  onBack: () => void;
  onContinue: () => void;
};

const roundedFont = "Fredoka_700Bold";

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
          <LeluaLogo compact style={styles.logo} />
          <View style={styles.lumiGreeting}>
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                <Text style={styles.speechLead}>Vamos</Text>
                {"\n"}
                <Text style={styles.speechHighlight}>começar?</Text>
              </Text>
              <View style={styles.speechTail} />
              <View style={[styles.speechSpark, styles.speechSparkTop]} />
              <View style={[styles.speechSpark, styles.speechSparkMiddle]} />
              <View style={[styles.speechSpark, styles.speechSparkBottom]} />
            </View>
            <LumiCharacter
              accessibilityLabel="Leluá, personagem broto"
              expression="main"
              size="large"
              style={styles.greetingCharacter}
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
            icon="user"
            label="Nome"
            onChangeText={setName}
            value={name}
          />
          <SignupField
            autoCapitalize="none"
            icon="mail"
            keyboardType="email-address"
            label="E-mail"
            onChangeText={setEmail}
            value={email}
          />
          <View style={styles.passwordWrap}>
            <SignupField
              autoCapitalize="none"
              icon="lock"
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
              <FieldIcon type={showPassword ? "eyeClosed" : "eye"} />
            </Pressable>
          </View>

          <View style={styles.errorSlot}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <PrimaryButton
            label="Continuar"
            onPress={continueLocally}
            style={styles.continueButton}
            textStyle={styles.primaryButtonText}
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
  icon: "user" | "mail" | "lock";
  label: string;
};

function SignupField({ icon, label, ...props }: SignupFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>
        <FieldIcon type={icon} />
      </View>
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

function FieldIcon({
  type,
}: {
  type: "user" | "mail" | "lock" | "eye" | "eyeClosed";
}) {
  if (type === "user") {
    return (
      <View style={styles.userIcon}>
        <View style={styles.userHead} />
        <View style={styles.userBody} />
      </View>
    );
  }
  if (type === "mail") {
    return (
      <View style={styles.mailIcon}>
        <View style={[styles.mailFold, styles.mailFoldLeft]} />
        <View style={[styles.mailFold, styles.mailFoldRight]} />
      </View>
    );
  }
  if (type === "lock") {
    return (
      <View style={styles.lockIcon}>
        <View style={styles.lockShackle} />
        <View style={styles.lockBody} />
      </View>
    );
  }
  return (
    <View style={styles.eyeShape}>
      <View style={styles.eyePupil} />
      {type === "eyeClosed" ? <View style={styles.eyeSlash} /> : null}
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
    left: -18,
    top: "17%",
  },
  cloudRight: {
    right: -24,
    top: "13%",
    transform: [{ scale: 0.62 }],
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
    paddingTop: 14,
    paddingBottom: 16,
  },
  top: {
    width: "100%",
    maxWidth: 400,
    height: 196,
    alignItems: "center",
    position: "relative",
    overflow: "visible",
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
    width: 210,
    height: 94,
  },
  lumiGreeting: {
    position: "absolute",
    right: 0,
    bottom: -20,
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "visible",
  },
  speechBubble: {
    width: 126,
    minHeight: 66,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 23,
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 26,
    borderWidth: 2,
    borderColor: "#F7FCFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    marginTop: 38,
    marginRight: 0,
    zIndex: 2,
    overflow: "visible",
    transform: [{ rotate: "-3deg" }],
    ...shadow,
  },
  speechTail: {
    position: "absolute",
    right: -8,
    top: 25,
    width: 19,
    height: 19,
    borderBottomRightRadius: 6,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#F7FCFF",
    backgroundColor: colors.white,
    transform: [{ rotate: "45deg" }],
    zIndex: 1,
  },
  speechText: {
    fontFamily: roundedFont,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
    transform: [{ rotate: "3deg" }],
    zIndex: 2,
  },
  speechLead: {
    color: "#164C70",
  },
  speechHighlight: {
    color: "#2FAE67",
    fontSize: 18,
    fontWeight: "700",
  },
  speechSpark: {
    position: "absolute",
    left: -12,
    width: 9,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#F6C945",
  },
  speechSparkTop: {
    top: 16,
    transform: [{ rotate: "28deg" }],
  },
  speechSparkMiddle: {
    top: 29,
    left: -15,
  },
  speechSparkBottom: {
    top: 42,
    transform: [{ rotate: "-28deg" }],
  },
  greetingCharacter: {
    width: 145,
    height: 155,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
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
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 12,
  },
  field: {
    minHeight: 58,
    borderWidth: 1.5,
    borderColor: "#D4DEE5",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#FAFCFD",
  },
  fieldIcon: {
    width: 30,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 55,
    paddingHorizontal: 12,
    color: colors.ink,
    fontSize: 16,
    fontFamily: "Nunito_500Medium",
  },
  passwordWrap: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 16,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  userIcon: {
    width: 20,
    height: 24,
    alignItems: "center",
  },
  userHead: {
    width: 8,
    height: 8,
    borderWidth: 2,
    borderColor: "#587181",
    borderRadius: 4,
  },
  userBody: {
    position: "absolute",
    bottom: 0,
    width: 18,
    height: 11,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#587181",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  mailIcon: {
    width: 22,
    height: 16,
    borderWidth: 2,
    borderColor: "#587181",
    borderRadius: 3,
    overflow: "hidden",
  },
  mailFold: {
    position: "absolute",
    top: 1,
    width: 15,
    height: 2,
    backgroundColor: "#587181",
  },
  mailFoldLeft: {
    left: -1,
    transform: [{ rotate: "31deg" }],
  },
  mailFoldRight: {
    right: -1,
    transform: [{ rotate: "-31deg" }],
  },
  lockIcon: {
    width: 20,
    height: 23,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lockShackle: {
    position: "absolute",
    top: 0,
    width: 11,
    height: 11,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#587181",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  lockBody: {
    width: 18,
    height: 14,
    borderWidth: 2,
    borderColor: "#587181",
    borderRadius: 3,
  },
  eyeShape: {
    width: 24,
    height: 16,
    borderWidth: 2,
    borderColor: "#587181",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#587181",
  },
  eyeSlash: {
    position: "absolute",
    width: 27,
    height: 2,
    backgroundColor: "#587181",
    transform: [{ rotate: "-35deg" }],
  },
  errorSlot: {
    height: 18,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#B64B45",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Nunito_500Medium",
    textAlign: "center",
  },
  continueButton: {
    width: "100%",
    minHeight: 60,
    marginTop: 0,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#D9E2E7",
  },
  dividerText: {
    color: "#60737E",
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
  socialButton: {
    minHeight: 54,
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
    fontFamily: "Nunito_700Bold",
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
    fontFamily: "Nunito_400Regular",
  },
  primaryButtonText: {
    fontFamily: "Fredoka_700Bold",
  },
});