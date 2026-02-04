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

export default function Starter() {
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
    primary: "#00aad2",
    toggleBg: isDark
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.06)",
    icon: isDark ? "#facc15" : "#0f172a",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable
        style={[styles.themeToggle, { backgroundColor: colors.toggleBg }]}
        onPress={() => setTheme(isDark ? "light" : "dark")}
        hitSlop={10}
      >
        <Ionicons
          name={isDark ? "sunny" : "moon"}
          size={20}
          color={colors.icon}
        />
      </Pressable>

      <Image
        source={require("../assets/images/image (1).png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: colors.title }]}>
        آینده‌ات از همین‌جا شروع میشه 🚀
      </Text>

      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        آماده‌ای قدم بعدی رو هوشمندانه برداری؟
      </Text>

      <Pressable
        android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.primary,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        onPress={() => router.push("/_sitemap")}
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
    top: 56,
    right: 20,
    padding: 10,
    borderRadius: 999,
    opacity: 0.65,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 24,
  },

  button: {
    paddingVertical: 16,
    paddingHorizontal: 110,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
