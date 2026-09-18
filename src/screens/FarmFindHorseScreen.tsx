import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

type Answer = "cow" | "horse" | "hen";

type Props = {
  onBack: () => void;
  onOpenSettings: () => void;
};

export function FarmFindHorseScreen({ onBack, onOpenSettings }: Props) {
  const { height, width: viewportWidth } = useWindowDimensions();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const screenWidth = Math.min(520, viewportWidth);

  const choose = (next: Answer) => {
    setAnswer(next);
    setFeedback(null);
  };

  const respond = () => {
    if (!answer) {
      setFeedback("Escolha um animal primeiro.");
      return;
    }
    setFeedback(answer === "horse" ? "Muito bem! Você encontrou o cavalo!" : "Quase! Tente novamente.");
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <View style={[styles.screen, { width: screenWidth, height }]}>
        <ImageBackground
          accessibilityLabel="Atividade Encontre o cavalo"
          resizeMode="cover"
          source={require("../../assets/images/farm-find-horse-lelua.png")}
          style={styles.artwork}
        >
          <Pressable accessibilityLabel="Voltar" hitSlop={10} onPress={onBack} style={styles.back} />
          <Pressable accessibilityLabel="Configurações" hitSlop={10} onPress={onOpenSettings} style={styles.settings} />

          <AnswerButton selected={answer === "cow"} style={styles.cow} onPress={() => choose("cow")} label="vaca" />
          <AnswerButton selected={answer === "horse"} style={styles.horse} onPress={() => choose("horse")} label="cavalo" />
          <AnswerButton selected={answer === "hen"} style={styles.hen} onPress={() => choose("hen")} label="galinha" />

          {feedback ? (
            <View style={[styles.feedback, answer === "horse" ? styles.feedbackSuccess : styles.feedbackTryAgain]}>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          ) : null}

          <Pressable accessibilityLabel="Responder" onPress={respond} style={styles.respond} />
        </ImageBackground>
      </View>
    </View>
  );
}

function AnswerButton({ label, onPress, selected, style }: { label: string; onPress: () => void; selected: boolean; style: object }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.answer, style, selected && styles.answerSelected]}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#71CEF1" },
  screen: { maxWidth: 520, overflow: "hidden" },
  artwork: { flex: 1, width: "100%", height: "100%" },
  back: { position: "absolute", left: "2.5%", top: "2.5%", width: "14%", height: "8%" },
  settings: { position: "absolute", right: "2.5%", top: "2.5%", width: "14%", height: "8%" },
  answer: { position: "absolute", left: "7.5%", width: "85%", height: "12%", borderRadius: 28 },
  answerSelected: { borderWidth: 4, borderColor: "#2FC64F", backgroundColor: "rgba(92, 218, 89, 0.16)" },
  cow: { top: "40.2%" },
  horse: { top: "53.2%" },
  hen: { top: "66.2%" },
  respond: { position: "absolute", left: "14%", bottom: "10.5%", width: "72%", height: "8.5%", borderRadius: 38 },
  feedback: { position: "absolute", right: "10%", bottom: "20%", left: "10%", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, alignItems: "center" },
  feedbackSuccess: { backgroundColor: "#21B84B" },
  feedbackTryAgain: { backgroundColor: "#F29D38" },
  feedbackText: { color: "#FFFFFF", fontFamily: "Fredoka_700Bold", fontSize: 16, textAlign: "center" },
});
