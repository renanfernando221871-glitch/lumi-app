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

function PottedPlantIcon() {
  return (
    <View style={styles.plantIcon}>
      <View style={[styles.plantLeaf, styles.plantLeafLeft]} />
      <View style={[styles.plantLeaf, styles.plantLeafTop]} />
      <View style={[styles.plantLeaf, styles.plantLeafRight]} />
      <View style={styles.plantStem} />
      <View style={styles.plantPotRim} />
      <View style={styles.plantPot} />
    </View>
  );
}

function CrossingIcon({
  variant,
  featured = false,
}: {
  variant: "safe-crossing" | "red-signal" | "outside-crossing";
  featured?: boolean;
}) {
  const safe = variant === "safe-crossing";
  const outside = variant === "outside-crossing";
  return (
    <View style={[styles.crossingIcon, featured && styles.crossingIconFeatured]}>
      {!outside ? (
        <View style={styles.miniSignal}>
          <View
            style={[
              styles.signalLight,
              { backgroundColor: safe ? "#48A85A" : "#E75D55" },
            ]}
          />
        </View>
      ) : (
        <View style={styles.walker}>
          <View style={styles.walkerHead} />
          <View style={styles.walkerBody} />
          <View style={[styles.walkerLimb, styles.walkerArm]} />
          <View style={[styles.walkerLimb, styles.walkerLeg]} />
        </View>
      )}
      <View style={[styles.road, outside && styles.roadOutside]}>
        {!outside
          ? [0, 1, 2, 3].map((stripe) => (
              <View key={stripe} style={styles.crosswalkStripe} />
            ))
          : null}
      </View>
    </View>
  );
}

function PersonFigure({
  sad = false,
  walking = false,
}: {
  sad?: boolean;
  walking?: boolean;
}) {
  return (
    <View style={[styles.personFigure, walking && styles.personWalking]}>
      <View style={styles.personHead}>
        <View style={styles.personEyes}>
          <View style={styles.personEye} />
          <View style={styles.personEye} />
        </View>
        <View style={sad ? styles.personSadMouth : styles.personSmile} />
        {sad ? <View style={styles.personTear} /> : null}
      </View>
      <View style={styles.personShirt} />
      <View style={[styles.personLimb, styles.personLeftArm]} />
      <View style={[styles.personLimb, styles.personRightArm]} />
      <View style={[styles.personLimb, styles.personLeftLeg]} />
      <View style={[styles.personLimb, styles.personRightLeg]} />
    </View>
  );
}

function ToyShape({
  kind,
  style,
}: {
  kind: "ball" | "block" | "car";
  style?: object;
}) {
  if (kind === "ball") {
    return <View style={[styles.toyBall, style]} />;
  }
  if (kind === "car") {
    return (
      <View style={[styles.toyCar, style]}>
        <View style={[styles.toyWheel, styles.toyWheelLeft]} />
        <View style={[styles.toyWheel, styles.toyWheelRight]} />
      </View>
    );
  }
  return <View style={[styles.toyBlock, style]} />;
}

function HelpFriendVisual({
  variant,
  featured = false,
}: {
  variant: "help-store" | "walk-away" | "take-toy";
  featured?: boolean;
}) {
  if (featured) {
    return (
      <View style={styles.helpScene}>
        <PersonFigure sad />
        <View style={styles.scatteredToys}>
          <ToyShape kind="ball" style={styles.scatteredBall} />
          <ToyShape kind="block" style={styles.scatteredBlockOne} />
          <ToyShape kind="block" style={styles.scatteredBlockTwo} />
          <ToyShape kind="car" style={styles.scatteredCar} />
        </View>
      </View>
    );
  }

  if (variant === "help-store") {
    return (
      <View style={styles.actionScene}>
        <PersonFigure />
        <ToyShape kind="ball" style={styles.actionToy} />
        <View style={styles.toyBasket}>
          <View style={styles.basketHandle} />
        </View>
      </View>
    );
  }
  if (variant === "walk-away") {
    return (
      <View style={styles.actionScene}>
        <View style={styles.motionLines}>
          <View style={styles.motionLine} />
          <View style={[styles.motionLine, styles.motionLineShort]} />
        </View>
        <PersonFigure walking />
      </View>
    );
  }
  return (
    <View style={styles.actionScene}>
      <PersonFigure />
      <ToyShape kind="ball" style={styles.heldToy} />
    </View>
  );
}

export function TapAndFindEngine({
  activity,
  onInteraction,
  disabled = false,
}: TapAndFindEngineProps) {
  const colorOptions = activity.config.presentation === "color-options";
  const soundOptions = activity.config.presentation === "sound-options";
  const emotionOptions = activity.config.presentation === "emotion-options";
  const actionOptions = activity.config.presentation === "action-options";
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
    <View
      style={[
        styles.grid,
        soundOptions && styles.soundGrid,
        emotionOptions && styles.emotionGrid,
        actionOptions && styles.actionGrid,
      ]}
    >
      {activity.config.items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          disabled={disabled}
          onPress={() => choose(item.id)}
          style={({ pressed }) => [
            styles.itemCard,
            soundOptions && styles.soundCard,
            emotionOptions && styles.emotionCard,
            actionOptions && styles.actionCard,
            {
              backgroundColor: item.color,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          {item.itemVisual === "potted-plant" ? (
            <PottedPlantIcon />
          ) : item.itemVisual === "safe-crossing" ||
            item.itemVisual === "red-signal" ||
            item.itemVisual === "outside-crossing" ? (
            <CrossingIcon variant={item.itemVisual} />
          ) : item.itemVisual === "help-store" ||
            item.itemVisual === "walk-away" ||
            item.itemVisual === "take-toy" ? (
            <HelpFriendVisual variant={item.itemVisual} />
          ) : (
            <Text
              style={[
                styles.itemEmoji,
                soundOptions && styles.soundText,
              emotionOptions && styles.emotionEmoji,
              actionOptions && styles.actionEmoji,
                item.emojiScale
                  ? { fontSize: 47 * item.emojiScale }
                  : undefined,
              ]}
            >
              {item.emoji}
            </Text>
          )}
          {!soundOptions && !emotionOptions ? (
            <Text style={[styles.itemLabel, actionOptions && styles.actionLabel]}>
              {item.label}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {activity.config.featuredVisual === "traffic-crossing" ? (
        <View
          accessibilityLabel={activity.config.featuredLabel}
          style={styles.featured}
        >
          <CrossingIcon variant="safe-crossing" featured />
        </View>
      ) : activity.config.featuredVisual === "help-friend-scene" ? (
        <View
          accessibilityLabel={activity.config.featuredLabel}
          style={[styles.featured, styles.helpFeatured]}
        >
          <HelpFriendVisual variant="help-store" featured />
        </View>
      ) : activity.config.featuredEmoji ? (
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
  plantIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  plantLeaf: {
    position: "absolute",
    width: 22,
    height: 14,
    borderRadius: 12,
    backgroundColor: "#3F9A55",
  },
  plantLeafLeft: {
    top: 10,
    left: 5,
    transform: [{ rotate: "32deg" }],
  },
  plantLeafTop: {
    top: 2,
    left: 15,
    backgroundColor: "#56AD63",
    transform: [{ rotate: "88deg" }],
  },
  plantLeafRight: {
    top: 10,
    right: 5,
    backgroundColor: "#70BC68",
    transform: [{ rotate: "-32deg" }],
  },
  plantStem: {
    position: "absolute",
    bottom: 16,
    width: 4,
    height: 19,
    borderRadius: 2,
    backgroundColor: "#397A46",
  },
  plantPotRim: {
    width: 31,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D87548",
    zIndex: 1,
  },
  plantPot: {
    width: 25,
    height: 15,
    marginTop: -1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#C65D3B",
  },
  crossingIcon: {
    width: 78,
    height: 48,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 7,
  },
  crossingIconFeatured: {
    width: 112,
    height: 62,
    transform: [{ scale: 1.15 }],
  },
  miniSignal: {
    width: 22,
    height: 40,
    borderRadius: 7,
    backgroundColor: "#40545B",
    alignItems: "center",
    justifyContent: "center",
  },
  signalLight: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#F4F0D8",
  },
  road: {
    width: 48,
    height: 31,
    borderRadius: 5,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#72858C",
  },
  roadOutside: {
    width: 54,
    backgroundColor: "#819399",
  },
  crosswalkStripe: {
    width: 6,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  walker: {
    width: 20,
    height: 39,
    alignItems: "center",
  },
  walkerHead: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#D99A72",
  },
  walkerBody: {
    width: 8,
    height: 18,
    marginTop: 1,
    borderRadius: 4,
    backgroundColor: "#4E8DB7",
  },
  walkerLimb: {
    position: "absolute",
    width: 4,
    height: 15,
    borderRadius: 2,
    backgroundColor: "#355B73",
  },
  walkerArm: {
    top: 14,
    left: 3,
    transform: [{ rotate: "35deg" }],
  },
  walkerLeg: {
    bottom: 0,
    right: 3,
    transform: [{ rotate: "-25deg" }],
  },
  helpFeatured: {
    minWidth: 220,
    minHeight: 120,
  },
  helpScene: {
    width: 190,
    height: 90,
    flexDirection: "row",
    alignItems: "center",
  },
  personFigure: {
    width: 42,
    height: 67,
    alignItems: "center",
  },
  personWalking: {
    transform: [{ rotate: "5deg" }],
  },
  personHead: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#D99A72",
    alignItems: "center",
  },
  personEyes: {
    marginTop: 9,
    flexDirection: "row",
    gap: 8,
  },
  personEye: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#304A45",
  },
  personSmile: {
    width: 9,
    height: 5,
    marginTop: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#8C4E42",
    borderRadius: 5,
  },
  personSadMouth: {
    width: 9,
    height: 5,
    marginTop: 5,
    borderTopWidth: 2,
    borderTopColor: "#8C4E42",
    borderRadius: 5,
  },
  personTear: {
    position: "absolute",
    top: 14,
    right: 4,
    width: 5,
    height: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: "#73B8E5",
  },
  personShirt: {
    width: 25,
    height: 25,
    marginTop: 1,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    backgroundColor: "#5F91AE",
  },
  personLimb: {
    position: "absolute",
    width: 5,
    height: 18,
    borderRadius: 3,
    backgroundColor: "#355B73",
  },
  personLeftArm: {
    top: 34,
    left: 4,
    transform: [{ rotate: "22deg" }],
  },
  personRightArm: {
    top: 34,
    right: 4,
    transform: [{ rotate: "-22deg" }],
  },
  personLeftLeg: {
    bottom: 0,
    left: 11,
    transform: [{ rotate: "9deg" }],
  },
  personRightLeg: {
    bottom: 0,
    right: 11,
    transform: [{ rotate: "-9deg" }],
  },
  scatteredToys: {
    flex: 1,
    height: 82,
    marginLeft: 13,
  },
  toyBall: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#F2A65A",
    borderWidth: 4,
    borderColor: "#FFF0A8",
  },
  toyBlock: {
    width: 23,
    height: 23,
    borderRadius: 5,
    backgroundColor: "#6EB5D9",
    borderWidth: 3,
    borderColor: "#D8ECFC",
  },
  toyCar: {
    width: 36,
    height: 18,
    borderRadius: 6,
    backgroundColor: "#E66D63",
  },
  toyWheel: {
    position: "absolute",
    bottom: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#40545B",
  },
  toyWheelLeft: { left: 5 },
  toyWheelRight: { right: 5 },
  scatteredBall: {
    position: "absolute",
    top: 3,
    left: 12,
  },
  scatteredBlockOne: {
    position: "absolute",
    top: 8,
    right: 13,
    transform: [{ rotate: "20deg" }],
  },
  scatteredBlockTwo: {
    position: "absolute",
    bottom: 5,
    left: 35,
    backgroundColor: "#F3C557",
    transform: [{ rotate: "-18deg" }],
  },
  scatteredCar: {
    position: "absolute",
    bottom: 7,
    right: 3,
    transform: [{ rotate: "8deg" }],
  },
  actionScene: {
    width: 78,
    height: 55,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  actionToy: {
    position: "absolute",
    width: 15,
    height: 15,
    right: 7,
    top: 2,
    zIndex: 2,
  },
  toyBasket: {
    width: 31,
    height: 23,
    marginLeft: -4,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#A8683D",
    backgroundColor: "#E3A75F",
  },
  basketHandle: {
    position: "absolute",
    top: -11,
    left: 5,
    width: 15,
    height: 12,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: "#A8683D",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  motionLines: {
    width: 23,
    height: 34,
    justifyContent: "center",
    gap: 8,
  },
  motionLine: {
    width: 21,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#7AA6BA",
  },
  motionLineShort: {
    width: 14,
  },
  heldToy: {
    position: "absolute",
    width: 18,
    height: 18,
    right: 4,
    top: 20,
  },
  soundGrid: {
    maxWidth: 390,
    flexWrap: "nowrap",
    gap: 22,
  },
  soundCard: {
    width: 96,
    height: 76,
    borderRadius: 20,
  },
  soundText: {
    fontSize: 25,
    lineHeight: 30,
    color: colors.deepGreen,
    fontWeight: "900",
  },
  emotionGrid: {
    maxWidth: 410,
    flexWrap: "nowrap",
    gap: 20,
  },
  emotionCard: {
    width: 112,
    height: 102,
    borderRadius: 24,
  },
  emotionEmoji: {
    fontSize: 45,
  },
  actionGrid: {
    maxWidth: 410,
    flexWrap: "nowrap",
    gap: 18,
  },
  actionCard: {
    width: 116,
    height: 108,
    borderRadius: 24,
    paddingHorizontal: 6,
  },
  actionEmoji: {
    fontSize: 34,
  },
  actionLabel: {
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 5,
  },
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