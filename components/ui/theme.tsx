import React, { createContext, useContext, useMemo, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";

export const getTheme = (mode: ThemeMode) => {
  const isDark = mode === "dark";

  const colors = {
    background: isDark ? "#020617" : "#f8fafc",
    title: isDark ? "#ffffff" : "#020617",
    subtitle: isDark ? "#cbd5f5" : "#475569",
    primary: "#00aad2",
    text: isDark ? "#e2e8f0" : "#0f172a",
    muted: isDark ? "#94a3b8" : "#64748b",
    card: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "#1e293b" : "#e2e8f0",
    error: isDark ? "#fca5a5" : "#dc2626",
    toggleBg: isDark
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.06)",
    icon: isDark ? "#facc15" : "#0f172a",
    primarySoft: isDark ? "rgba(56,189,248,0.18)" : "rgba(14,165,233,0.12)",
  };

  const text = {
    title: {
      fontSize: 28,
      fontWeight: "900" as const,
      marginBottom: 12,
      textAlign: "center" as const,
      color: colors.title,
    },
    subtitle: {
      fontSize: 15,
      textAlign: "center" as const,
      marginBottom: 48,
      lineHeight: 24,
      color: colors.subtitle,
    },
  };

  return { colors, text };
};

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  colors: ReturnType<typeof getTheme>["colors"];
  text: ReturnType<typeof getTheme>["text"];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemTheme ?? "dark");

  const value = useMemo(() => {
    const theme = getTheme(mode);
    return {
      mode,
      setMode,
      toggle: () => setMode(mode === "dark" ? "light" : "dark"),
      ...theme,
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
