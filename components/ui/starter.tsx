import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { sharedStyles, useTheme } from "./theme";

export default function Starter() {
  const { colors, text } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        sharedStyles.centered,
        { backgroundColor: colors.background },
      ]}
    >
      <Image
        source={require("../../assets/images/image (1).png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={text.title}>
        آینده‌ات از همین‌جا شروع میشه 
      </Text>

      <Text
        style={[
          text.subtitle,
          {
            textAlign: "right",
            marginLeft: 95,
            writingDirection: "rtl",
          },
        ]}
      >
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
        onPress={() => router.push("/auth/phone")}
      >
        <Text style={styles.buttonText}>بزن بریم </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 350,
    height: 350,
    marginBottom: 40,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 140,
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
