import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BackButton } from "../components/BackButton";
import { LumiSpeechBubble } from "../components/LumiSpeechBubble";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme/colors";
import { Shell } from "./components/Shell";

type Props = {
  initialName: string;
  onBack: () => void;
  onContinue: (name: string, avatar: string) => void;
};

export function PersonalizeScreen({
  initialName,
  onBack,
  onContinue,
}: Props) {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState("🌻");
  const avatars = ["🌻", "🦋", "🐰", "🦊"];

  return (
    <Shell>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inner}>
          <BackButton onPress={onBack} />
          <Text style={styles.pageKicker}>UM POUQUINHO SOBRE VOCÊ</Text>
          <Text style={styles.pageTitle}>Como posso te chamar?</Text>
          <LumiSpeechBubble compact>
            Escolha um nome e uma carinha!
          </LumiSpeechBubble>
          <Text style={styles.inputLabel}>SEU NOME</Text>
          <TextInput
            accessibilityLabel="Seu nome"
            autoCapitalize="words"
            maxLength={18}
            placeholder="Seu nome"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
            style={styles.fakeInput}
          />
          <Text style={styles.inputHint}>Pode ser seu nome ou um apelido.</Text>
          <Text style={styles.inputLabel}>SUA COMPANHEIRA</Text>
          <View style={styles.avatarRow}>
            {avatars.map((item) => (
              <Pressable
                key={item}
                onPress={() => setAvatar(item)}
                accessibilityRole="button"
                accessibilityLabel={`Escolher companheira ${item}`}
                style={[styles.avatar, avatar === item && styles.selectedAvatar]}
              >
                <Text style={styles.avatarEmoji}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <PrimaryButton
            label="Entrar no meu jardim"
            onPress={() => onContinue(name.trim() || "Amigo", avatar)}
            variant="green"
            style={styles.fullButton}
          />
        </View>
      </ScrollView>
    </Shell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingVertical: 22,
  },
  inner: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingBottom: 25,
  },
  pageKicker: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginTop: 11,
  },
  pageTitle: {
    color: colors.deepGreen,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
    marginTop: 4,
    marginBottom: 18,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: "900",
    marginTop: 27,
    marginBottom: 8,
  },
  fakeInput: {
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 17,
    color: colors.deepGreen,
    fontSize: 16,
    fontWeight: "700",
    backgroundColor: colors.white,
  },
  inputHint: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 7,
  },
  avatarRow: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.line,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  selectedAvatar: {
    borderColor: colors.green,
    backgroundColor: colors.softGreen,
    borderWidth: 4,
  },
  fullButton: {
    width: "100%",
    marginTop: 20,
  },
});