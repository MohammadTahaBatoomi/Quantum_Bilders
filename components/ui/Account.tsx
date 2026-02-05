import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  StatusBar,
} from "react-native";
import { useTheme } from "./theme";
import ThemeToggle from "./ThemeToggle";
import BottomNav from "./BottomNav";

const Account = () => {
  const { colors, text, mode } = useTheme();

  const [fullName, setFullName] = useState("محمد طاها");
  const [field, setField] = useState("مهندسی کامپیوتر");

  const onSave = () => {
    // بعداً وصل میشه به API
    console.log("Saved:", { fullName, field });
  };

  return (
    <>

      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[text.title, styles.title]}>حساب کاربری</Text>
              <Text style={[text.subtitle, styles.subtitle]}>
                مدیریت اطلاعات و تنظیمات
              </Text>
            </View>
            <ThemeToggle variant="inline" />
          </View>

          {/* Info Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.title }]}>
              اطلاعات شخصی
            </Text>

            <Text style={[styles.label, { color: colors.muted }]}>
              نام و نام خانوادگی
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.title,
                },
              ]}
              placeholder="نام و نام خانوادگی"
              placeholderTextColor={colors.muted}
            />

            <Text style={[styles.label, { color: colors.muted }]}>
              رشته تحصیلی
            </Text>
            <TextInput
              value={field}
              onChangeText={setField}
            aria-disabled
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.title,
                },
              ]}
              placeholder="مثلاً: کامپیوتر"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Settings */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.title }]}>
              تنظیمات
            </Text>

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.subtitle }]}>
                تم برنامه
              </Text>
              <ThemeToggle variant="switch" />
            </View>
          </View>

          {/* Save */}
          <Pressable
            onPress={onSave}
            style={({ pressed }) => [
              styles.saveBtn,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={styles.saveText}>ذخیره تغییرات</Text>
          </Pressable>
        </ScrollView>

        <BottomNav />
      </View>
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 120 },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { textAlign: "right" },
  subtitle: { textAlign: "right" },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "right",
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 14,
    textAlign: "right",
  },

  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  saveBtn: {
    marginTop: 6,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
