import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityInteraction, TapAndFindActivity } from "../../types";
import { evaluateTapAndFind } from "../../engines/interactions";
import { colors, shadow } from "../../theme/colors";

export type TapAndFindEngineProps = {
  activity: TapAndFindActivity;
  onInteraction: (interaction: ActivityInteraction) => void;
  disabled?: boolean;
};

export function TapAndFindEngine({
  activity,
  onInteraction,
  disabled = false,
}: TapAndFindEngineProps) {
  const colorOptions = activity.config.presentation === "color-options";
  const choose = (id: string) => {
    if (disabled) return;
    onInteraction(evaluateTapAndFind(activity, id));
  };

  const choices = colorOptions ? (
    <View style={styles.colorOptions}>
      {activity.config.items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          disabled={disabled}
          onPress={() => choose(item.id)}
          style={({ pressed }) => [
            styles.colorCard,
            { borderColor: item.color, opacity: pressed ? 0.72 : 1 },
          ]}
        >
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          {item.colorGlyph ? (
            <View style={styles.colorGlyphContainer}>
              <Text style={[styles.colorGlyph, { color: item.color }]}>
                {item.colorGlyph}
              </Text>
              <View
                style={[
                  styles.colorGlyphTail,
                  { borderColor: item.color },
                ]}
              />
            </View>
          ) : (
            <Text
              style={[
                styles.colorEmoji,
                item.emojiScale
                  ? { fontSize: 41 * item.emojiScale }
                  : undefined,
              ]}
            >
              {item.emoji}
            </Text>
          )}
          <Text style={styles.colorLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  ) : (
    <View style={styles.grid}>
      {activity.config.items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          disabled={disabled}
          onPress={() => choose(item.id)}
          style={({ pressed }) => [
            styles.itemCard,
            {
              backgroundColor: item.color,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <Text
            style={[
              styles.itemEmoji,
              item.emojiScale
                ? { fontSize: 47 * item.emojiScale }
                : undefined,
            ]}
          >
            {item.emoji}
          </Text>
          <Text style={styles.itemLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {activity.config.featuredEmoji ? (
        <View
          accessibilityLabel={activity.config.featuredLabel}
          style={styles.featured}
        >
          <Text style={styles.featuredEmoji}>
            {activity.config.featuredEmoji}
          </Text>
        </View>
      ) : null}
      {choices}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", gap: 18 },
  featured: {
    minWidth: 150,
    minHeight: 92,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.softYellow,
    ...shadow,
  },
  featuredEmoji: { fontSize: 48 },
  grid: {
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  itemCard: {
    width: 145,
    height: 116,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  itemEmoji: { fontSize: 47 },
  itemLabel: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 3,
  },
  colorOptions: {
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  colorCard: {
    width: 150,
    minHeight: 110,
    borderWidth: 4,
    borderRadius: 22,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadow,
  },
  colorDot: {
    position: "absolute",
    top: 9,
    right: 11,
    width: 15,
    height: 15,
    borderRadius: 8,
  },
  colorEmoji: { fontSize: 41 },
  colorGlyphContainer: {
    height: 50,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  colorGlyph: {
    fontSize: 43,
    lineHeight: 43,
    fontWeight: "900",
  },
  colorGlyphTail: {
    width: 12,
    height: 12,
    marginTop: -4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "-35deg" }],
  },
  colorLabel: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 1,
  },
});