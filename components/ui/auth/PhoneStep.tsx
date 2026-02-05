import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { sharedStyles, useTheme } from "../theme";

type Props = {
  phone: string;
  onChangePhone: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
};

export const PhoneStep: React.FC<Props> = ({
  phone,
  onChangePhone,
  onSubmit,
  loading,
  error,
}) => {
  const { colors, text } = useTheme();

  return (
    <View style={[sharedStyles.centered, { backgroundColor: colors.background }]}>
      <Text style={text.title}>شماره موبایل‌ات رو وارد کن 📱</Text>
      <Text style={[text.subtitle, { marginTop: 8 }]}>
        برای شروع، فقط به شماره موبایلت نیاز داریم.
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
        ]}
        keyboardType="phone-pad"
        placeholder="مثلاً 09123456789"
        placeholderTextColor={colors.muted}
        value={phone}
        onChangeText={onChangePhone}
      />

      {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

      <Pressable
        android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.primary,
            opacity: loading ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "در حال پردازش..." : "ادامه"}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    maxWidth: 360,
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
  },
});

export default PhoneStep;

