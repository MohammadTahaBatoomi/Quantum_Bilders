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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { sharedStyles, useTheme } from "./theme";
import { ApiError, registerUser } from "../lib/api";
import { useUser } from "../state/UserContext";

const FIELDS = [
  "ریاضی فیزیک",
  "علوم تجربی",
  "علوم انسانی",
  "شبکه و نرم افزار فنی حرفه ای",
  "مکانیک فنی حرفه ای"
];

const Form = () => {
  const { colors, text } = useTheme();
  const router = useRouter();
  const { setUser } = useUser();

  const [fullName, setFullName] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [phone, setPhone] = useState("");
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [errors, setErrors] = useState<{
    fullName?: string;
    fieldOfStudy?: string;
    phone?: string;
  }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "نام و نام خانوادگی الزامی است.";
    }

    if (!fieldOfStudy) {
      nextErrors.fieldOfStudy = "لطفاً رشته تحصیلی را انتخاب کنید.";
    }

    if (!phone.trim()) {
      nextErrors.phone = "شماره همراه الزامی است.";
    } else if (!/^09\d{9}$/.test(phone)) {
      nextErrors.phone = "شماره باید ۱۱ رقم و با 09 شروع شود.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      // Helpful for debugging on web where Alert may not show
      console.log("Submitting form", {
        fullName,
        fieldOfStudy,
        phone,
      });
      const user = await registerUser({
        fullName: fullName.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        phone: phone.trim(),
      });
      setUser(user);
      router.push("/exam");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "ثبت اطلاعات با خطا مواجه شد.";
      setSubmitError(message);
      Alert.alert("خطا", message);
    } finally {
      setSubmitting(false);
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

      <TextInput
        autoFocus
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
          value={phone}
          onChangeText={setPhone}
          placeholder="شماره همراه"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          maxLength={11}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: errors.phone ? colors.error : colors.border,
            },
          ]}
          textAlign="right"
        />
        {!!errors.phone && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.phone}
          </Text>
        )}

        <Pressable
          onPress={() => setShowFieldModal(true)}
          style={[
            styles.selectBox,
            {
              backgroundColor: colors.card,
              borderColor: errors.fieldOfStudy
                ? colors.error
                : colors.border,
            },
          ]}
        >
          <Text
            style={{
              color: fieldOfStudy ? colors.text : colors.muted,
              fontSize: 16,
            }}
          >
            {fieldOfStudy || "انتخاب رشته تحصیلی"}
          </Text>
        </Pressable>
        {!!errors.fieldOfStudy && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {errors.fieldOfStudy}
          </Text>
        )}


        <Text style={[styles.hint, { color: colors.muted }]}>
          لطفاً تمام اطلاعات  
را به‌درستی وارد کنید.
        </Text>

        {!!submitError && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {submitError}
          </Text>
        )}

        {/* Submit */}
        <Pressable
          onPress={onSubmit}
          disabled={submitting}
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: colors.primary,
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: submitting ? 0.7 : 1,
            },
          ]}
        >
          <Text style={styles.submitText}>
            {submitting ? "در حال ارسال..." : "ثبت اطلاعات"}
          </Text>
        </Pressable>
      </View>

      {/* Modal */}
      <Modal
        visible={showFieldModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFieldModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFieldModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card },
            ]}
          >
            {FIELDS.map((item) => (
              <Pressable
                key={item}
                style={styles.modalItem}
                onPress={() => {
                  setFieldOfStudy(item.trim());
                  setShowFieldModal(false);
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    textAlign: "right",
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Form;

const styles = StyleSheet.create({
  logo: {
    width: 240,
    height: 240,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 16,
    textAlign: "right",
  },
  selectBox: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 16,
    textAlign: "right",
  },
  errorText: {
    width: "100%",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    textAlign: "right",
  },
  hint: {
    fontSize: 13,
    textAlign: "right",
    width: "100%",
    marginBottom: 16,
  },
  submitButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
