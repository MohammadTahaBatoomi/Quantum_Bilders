import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "./theme";
import ThemeToggle from "./ThemeToggle";
import BottomNav from "./BottomNav";
import { useUser } from "../state/UserContext";
import { storeUser } from "../state/authStorage";

const Account = () => {
  const { colors, text, mode } = useTheme();
  const router = useRouter();
  const { setUser } = useUser();

  const [fullName, setFullName] = useState("محمد طاها");
  const [field, setField] = useState("مهندسی کامپیوتر");

  const onSave = () => {
    console.log("Saved:", { fullName, field });
  };

  const onLogout = () => {
    Alert.alert("خروج از حساب", "می‌خوای از حساب کاربری خارج بشی؟", [
      { text: "انصراف", style: "cancel" },
      {
        text: "خروج",
        style: "destructive",
        onPress: () => {
          storeUser(null).catch(() => {});
          setUser(null);
          router.replace("/auth/phone");
        },
      },
    ]);
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
              editable={false}
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.muted,
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

          {/* About Us */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.title }]}>
              درباره ما
            </Text>

            <Text
              style={[
                styles.aboutText,
                { color: colors.subtitle },
              ]}
            >
              این اپلیکیشن با هدف کمک به رشد و پیشرفت حرفه‌ای توسعه‌دهندگان
              طراحی شده است. تمرکز ما روی مسیرهای شفاف یادگیری، تجربه کاربری
              ساده و ابزارهای کاربردی برای ساخت آینده‌ای بهتر است.
            </Text>

            <Text
              style={[
                styles.aboutFooter,
                { color: colors.muted },
              ]}
            >
              نسخه 1.0.0 — ساخته‌شده با ❤️
            </Text>
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

          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [
              styles.logoutBtn,
              {
                borderColor: colors.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={[styles.logoutText, { color: colors.title }]}>خروج از حساب</Text>
          </Pressable>
        </ScrollView>

        <BottomNav />
      </View>
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 140,
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    textAlign: "right",
  },

  subtitle: {
    textAlign: "right",
  },

  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  logoutBtn: {
    marginTop: 10,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "700",
  },

  aboutText: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: "right",
    marginBottom: 12,
  },

  aboutFooter: {
    fontSize: 11,
    textAlign: "right",
  },
});
