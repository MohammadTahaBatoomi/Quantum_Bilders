import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Modal,
  StatusBar,
} from "react-native";
import { sharedStyles, useTheme } from "../theme";

/* ===================== Types ===================== */

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
  onSubmit: (data: {
    fullName: string;
    fieldOfStudy: FieldOfStudy;
  }) => void;
  loading?: boolean;
  error?: string | null;
};

const FIELD_OPTIONS: FieldOfStudy[] = [
  "ریاضی فیزیک",
  "علوم تجربی",
  "علوم انسانی",
  "شبکه و نرم افزار / فنی حرفه ای ",
  "مکانیک / فنی حرفه ای",
];

/* ===================== Component ===================== */

const RegisterStep: React.FC<Props> = ({
  initialFullName = "",
  initialFieldOfStudy = "",
  phone,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const { colors, text } = useTheme();

  const [fullName, setFullName] = useState(initialFullName);
  const [fieldOfStudy, setFieldOfStudy] =
    useState<FieldOfStudy | "">(initialFieldOfStudy);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);

  /* ===================== Handlers ===================== */

  const handleSubmit = () => {
    if (!fullName.trim()) {
      setLocalError("نام و نام خانوادگی الزامی است.");
      return;
    }

    if (!fieldOfStudy) {
      setLocalError("لطفاً رشته تحصیلی را انتخاب کن.");
      return;
    }

    setLocalError(null);

    onSubmit({
      fullName: fullName.trim(),
      fieldOfStudy,
    });
  };

  /* ===================== Render ===================== */

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          sharedStyles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Image
          source={require("../../../assets/images/image (1).png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Text style={text.title}>ثبت‌نام سریع 🎓</Text>
          <Text style={[text.subtitle, { marginTop: 8 }]}>
            اطلاعاتت رو کامل کن تا تجربه بهتری داشته باشی
          </Text>

          <View style={styles.form}>
            {/* Full Name */}
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="نام و نام خانوادگی"
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                {
                  borderColor:
                    (localError && !fullName) || error
                      ? colors.error
                      : colors.border,
                  color: colors.text,
                },
              ]}
            />

            {/* Select Field */}
            <Pressable
              onPress={() => setSelectOpen(true)}
              style={[
                styles.selectBox,
                {
                  borderColor:
                    localError && !fieldOfStudy
                      ? colors.error
                      : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: fieldOfStudy ? colors.text : colors.muted,
                }}
              >
                {fieldOfStudy || "انتخاب رشته تحصیلی"}
              </Text>
              <Text style={{ color: colors.muted, fontSize: 16 }}>▾</Text>
            </Pressable>

            {(localError || error) && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                ⚠️ {localError || error}
              </Text>
            )}

            {/* Submit */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: colors.primary,
                  opacity: loading ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={styles.buttonText}>
                {loading ? "در حال ثبت‌نام..." : "تکمیل ثبت‌نام"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* ===================== Select Modal ===================== */}
      <Modal
        transparent
        animationType="fade"
        visible={selectOpen}
        statusBarTranslucent
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setSelectOpen(false)}
        />

        <View
          style={[
            styles.selectContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.selectTitle, { color: colors.title }]}>
            رشته تحصیلی
          </Text>

          {FIELD_OPTIONS.map((item) => {
            const selected = fieldOfStudy === item;

            return (
              <Pressable
                key={item}
                onPress={() => {
                  setFieldOfStudy(item);
                  setSelectOpen(false);
                }}
                style={[
                  styles.option,
                  selected && { backgroundColor: colors.primarySoft },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: colors.text },
                    selected && { color: colors.primary, fontWeight: "700" },
                  ]}
                >
                  {item}
                </Text>
                {selected && (
                  <Text style={[styles.check, { color: colors.primary }]}>
                    ✓
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </>
  );
};

export default RegisterStep;

/* ===================== Styles ===================== */

const styles = StyleSheet.create({
  logo: {
    width: 350,
    height: 350,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  form: {
    width: "100%",
    maxWidth: 350,
    marginTop: 16,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    textAlign: "right",
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  selectBox: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    textAlign: 'right'
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    width: 350,
    borderRadius: 18,
    elevation: 6,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  selectContainer: {
    position: "absolute",
    bottom: "22%",
    alignSelf: "center",
    width: "90%",
    maxWidth: 360,
    borderRadius: 26,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 25,
    elevation: 12,
  },
  selectTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
option: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 14,
  paddingLeft: 14,
  borderRadius: 16,
  textAlign: "right",
},

  optionText: {
    fontSize: 15,
  },
  check: {
    fontSize: 16,
    fontWeight: "700",
  },
});
