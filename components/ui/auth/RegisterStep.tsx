import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { sharedStyles, useTheme } from "../theme";

type FieldOfStudy =
  | "Mathematics"
  | "Experimental Sciences"
  | "Humanities"
  | "Technical Computer"
  | "Technical Mechanics";

type Props = {
  initialFullName?: string;
  initialFieldOfStudy?: FieldOfStudy | "";
  phone: string;
  onSubmit: (data: { fullName: string; fieldOfStudy: FieldOfStudy }) => void;
  loading?: boolean;
  error?: string | null;
};

const FIELD_OPTIONS: FieldOfStudy[] = [
  "Mathematics",
  "Experimental Sciences",
  "Humanities",
  "Technical Computer",
  "Technical Mechanics",
];

export const RegisterStep: React.FC<Props> = ({
  initialFullName = "",
  initialFieldOfStudy = "",
  phone,
  onSubmit,
  loading,
  error,
}) => {
  const { colors, text } = useTheme();
  const [fullName, setFullName] = useState(initialFullName);
  const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudy | "">(initialFieldOfStudy);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!fullName.trim()) {
      setLocalError("نام و نام خانوادگی الزامی است.");
      return;
    }
    if (!fieldOfStudy) {
      setLocalError("رشته تحصیلی را انتخاب کن.");
      return;
    }
    setLocalError(null);
    onSubmit({ fullName: fullName.trim(), fieldOfStudy });
  };

  return (
    <View style={[sharedStyles.centered, { backgroundColor: colors.background }]}>
      <Text style={text.title}>ثبت‌نام سریع 🎓</Text>
      <Text style={[text.subtitle, { marginTop: 8 }]}>
        اطلاعاتت رو کامل کن تا بتونیم تجربه شخصی‌سازی شده بهت بدیم.
      </Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.muted }]}>شماره موبایل</Text>
        <Text style={[styles.readonlyValue, { color: colors.text }]}>{phone}</Text>

        <Text style={[styles.label, { color: colors.muted }]}>نام و نام خانوادگی</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: (localError && !fullName) || error ? colors.error : colors.border,
              color: colors.text,
            },
          ]}
          placeholder="مثلاً علی رضایی"
          placeholderTextColor={colors.muted}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={[styles.label, { color: colors.muted }]}>رشته تحصیلی</Text>
        <View style={styles.chipContainer}>
          {FIELD_OPTIONS.map((option) => {
            const selected = fieldOfStudy === option;
            return (
              <Pressable
                key={option}
                style={[
                  styles.chip,
                  {
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? colors.primarySoft : "transparent",
                  },
                ]}
                onPress={() => setFieldOfStudy(option)}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    { color: selected ? colors.primary : colors.text },
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {localError ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{localError}</Text>
        ) : null}
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        ) : null}

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
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "در حال ثبت‌نام..." : "تکمیل ثبت‌نام و ورود"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
    maxWidth: 420,
    marginTop: 24,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  readonlyValue: {
    fontSize: 15,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 18,
    alignSelf: "flex-start",
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
    marginTop: 4,
    fontSize: 13,
  },
});

export default RegisterStep;

