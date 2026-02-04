import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  useColorScheme,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ModalScreen() {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">(
    systemTheme ?? "dark"
  );

  const isDark = theme === "dark";
  const router = useRouter();

  const colors = {
    background: isDark ? "#020617" : "#f8fafc",
    title: isDark ? "#ffffff" : "#020617",
    subtitle: isDark ? "#cbd5f5" : "#475569",
    primary: isDark ? "#6366f1" : "#4f46e5",
    toggleBg: isDark
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
    icon: isDark ? "#facc15" : "#0f172a",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Theme Toggle */}
      <Pressable
        style={[styles.themeToggle, { backgroundColor: colors.toggleBg }]}
        onPress={() => setTheme(isDark ? "light" : "dark")}
      >
        <Ionicons
          name={isDark ? "sunny" : "moon"}
          size={22}
          color={colors.icon}
        />
      </Pressable>

      {/* Logo */}
      <Image
        source={""}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Text */}
      <Text style={[styles.title, { color: colors.title }]}>
        آمادهٔ موفقیت هستی؟ 🚀
      </Text>

      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        بیا با هم قدم بعدی رو محکم برداریم
      </Text>

      {/* Button */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push(require("../assets/images/image (1).png"))}
      >
        <Text style={styles.buttonText}>بزن بریم 🔥</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  themeToggle: {
    position: "absolute",
    top: 60,
    right: 24,
    padding: 10,
    borderRadius: 999,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
  },

  button: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
