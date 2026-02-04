import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./theme";

const ThemeToggle = () => {
  const { mode, toggle, colors } = useTheme();

  return (
    <Pressable
      style={[styles.toggle, { backgroundColor: colors.toggleBg }]}
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
    position: "absolute",
    top: 56,
    right: 20,
    padding: 10,
    borderRadius: 999,
    opacity: 0.65,
    zIndex: 10,
  },
});
