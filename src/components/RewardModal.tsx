import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "../theme/colors";
import { PrimaryButton } from "./PrimaryButton";
import { RewardDefinition } from "../types";

export function RewardModal({
  visible,
  reward,
  onClose,
}: {
  visible: boolean;
  reward: RewardDefinition;
  onClose: () => void;
}) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable
            accessibilityLabel="Fechar conquista"
            accessibilityRole="button"
            onPress={onClose}
            style={styles.close}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.burst}>{reward.icon}</Text>
          <Text style={styles.eyebrow}>{reward.eyebrow}</Text>
          <Text style={styles.title}>{reward.title}</Text>
          <Text style={styles.message}>
            {reward.message}
          </Text>
          <View style={styles.flowerRow}>
            <Text>🌱</Text>
            <Text>🌼</Text>
            <Text>🌿</Text>
          </View>
          <PrimaryButton label="Continuar" onPress={onClose} variant="green" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(23, 105, 79, 0.43)",
  },
  card: {
    width: "100%",
    maxWidth: 390,
    borderRadius: 32,
    padding: 28,
    alignItems: "center",
    backgroundColor: colors.cream,
    ...shadow,
  },
  close: {
    position: "absolute",
    top: 16,
    right: 18,
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: colors.muted,
    fontSize: 30,
    fontWeight: "300",
  },
  burst: {
    fontSize: 64,
    marginBottom: 7,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.6,
  },
  title: {
    marginTop: 8,
    color: colors.deepGreen,
    fontSize: 28,
    lineHeight: 32,
    textAlign: "center",
    fontWeight: "900",
  },
  message: {
    maxWidth: 280,
    marginTop: 12,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
  },
  flowerRow: {
    flexDirection: "row",
    gap: 22,
    marginVertical: 18,
    fontSize: 26,
  },
});