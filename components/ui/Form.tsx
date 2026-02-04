import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { sharedStyles, useTheme } from "./theme";

const Form = () => {
  const { colors, text } = useTheme();

  const [fullName, setFullName] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "لطفاً نام و نام خانوادگی را وارد کنید.";
    }

    if (!fieldOfStudy.trim()) {
      nextErrors.fieldOfStudy = "لطفاً رشته تحصیلی را وارد کنید.";
    }

    if (!phone.trim()) {
      nextErrors.phone = "لطفاً شماره همراه را وارد کنید.";
    } else if (!/^[0-9]+$/.test(phone) || phone.length !== 11) {
      nextErrors.phone = "شماره همراه باید ۱۱ رقمی و فقط عدد باشد.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = () => {
    if (validate()) {
      Alert.alert("ثبت شد", "اطلاعات شما با موفقیت ثبت شد.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          sharedStyles.centered,
          {
            backgroundColor: colors.background,
            paddingHorizontal: 24,
          },
        ]}
      >
        <Image
          source={require("../../assets/images/image (1).png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={[text.title, { marginBottom: 32 }]}>
          اطلاعات فردی
        </Text>

        <Text style={[styles.hint, { color: colors.muted }]}>
          لطفاً اطلاعات را دقیق و به فارسی وارد کنید. تمام فیلدها اجباری هستند.
        </Text>

        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="نام و نام خانوادگی"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: errors.fullName ? colors.error : colors.border,
            },
          ]}
          textAlign="right"
        />
        {!!errors.fullName && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.fullName}
          </Text>
        )}

        <TextInput
          value={fieldOfStudy}
          onChangeText={setFieldOfStudy}
          placeholder="رشته تحصیلی"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: errors.fieldOfStudy ? colors.error : colors.border,
            },
          ]}
          textAlign="right"
        />
        {!!errors.fieldOfStudy && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.fieldOfStudy}
          </Text>
        )}

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="شماره همراه"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: errors.phone ? colors.error : colors.border,
            },
          ]}
          keyboardType="phone-pad"
          maxLength={11}
          textAlign="right"
        />
        {!!errors.phone && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.phone}
          </Text>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: colors.primary,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          onPress={onSubmit}
        >
          <Text style={styles.submitText}>ثبت اطلاعات</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Form;

const styles = StyleSheet.create({
  logo: {
    width: 260,
    height: 260,
    marginBottom: 24,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right",
    width: "100%",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    width: "100%",
    textAlign: "right",
  },
  submitButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
