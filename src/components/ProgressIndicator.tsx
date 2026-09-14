import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";

export function ProgressIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const compact = useWindowDimensions().width < 480;
  return (
    <View style={[styles.wrap, compact && styles.compactWrap]}>
      <View style={[styles.dots, compact && styles.compactDots]}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              compact && styles.compactDot,
              index < current && styles.done,
              index === current && styles.current,
            ]}
          >
            {index < current ? (
              <Text style={[styles.check, compact && styles.compactCheck]}>✓</Text>
            ) : null}
          </View>
        ))}
      </View>
      <Text style={styles.label}>
        {current} de {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dots: {
    flexDirection: "row",
    gap: 7,
  },
  compactWrap: { gap: 6 },
  compactDots: { gap: 3 },
  compactDot: { width: 16, height: 16, borderRadius: 8 },
  compactCheck: { fontSize: 10 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  done: {
    backgroundColor: colors.green,
  },
  current: {
    borderWidth: 3,
    borderColor: colors.yellow,
  },
  check: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 13,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
});