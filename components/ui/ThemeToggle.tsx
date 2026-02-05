import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./theme";

type ThemeToggleProps = {
  variant?: "floating" | "inline";
  style?: StyleProp<ViewStyle>;
};

const ThemeToggle = ({ variant = "floating", style }: ThemeToggleProps) => {
  const { mode, toggle, colors } = useTheme();
  const isFloating = variant === "floating";

  return (
    <Pressable
      style={[
        styles.toggle,
        { backgroundColor: colors.toggleBg },
        isFloating && styles.floating,
        style,
      ]}
      onPress={toggle}
      hitSlop={10}
    >
      <Ionicons
        name={mode === "dark" ? "sunny" : "moon"}
        size={20}
        color={colors.icon}
      />
    </Pressable>
  );
};

export default ThemeToggle;

const styles = StyleSheet.create({
  toggle: {
    padding: 10,
    borderRadius: 999,
    opacity: 0.65,
  },
  floating: {
    position: "absolute",
    top: 56,
    right: 20,
    zIndex: 10,
  },
});
