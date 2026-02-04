import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sharedStyles, useTheme } from "./theme";

export default function Starter() {
  const { colors, text, toggle, mode } = useTheme();
  const isDark = mode === "dark";
  const router = useRouter();

  return (
    <View
      style={[
        sharedStyles.centered,
        { backgroundColor: colors.background },
      ]}
    >
      <Pressable
        style={[styles.themeToggle, { backgroundColor: colors.toggleBg }]}
        onPress={toggle}
        hitSlop={10}
      >
        <Ionicons
          name={isDark ? "sunny" : "moon"}
          size={20}
          color={colors.icon}
        />
      </Pressable>

      <Image
        source={require("../../assets/images/image (1).png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={text.title}>
        آینده‌ات از همین‌جا شروع میشه 🚀
      </Text>

      <Text style={text.subtitle}>
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
        onPress={() => router.push("/form")}
      >
        <Text style={styles.buttonText}>بزن بریم 🔥</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    position: "absolute",
    top: 56,
    right: 20,
    padding: 10,
    borderRadius: 999,
    opacity: 0.65,
  },

  logo: {
    width: 350,
    height: 350,
    marginBottom: 40,
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
