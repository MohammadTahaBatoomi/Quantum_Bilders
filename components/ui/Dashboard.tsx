import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "./theme";
import ThemeToggle from "./ThemeToggle";
import BottomNav from "./BottomNav";
import { router } from "expo-router";

const Dashboard = () => {
  const { colors, text, mode } = useTheme();

  return (
    <>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />

      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={[text.title, styles.title]}>داشبورد</Text>
              <Text style={[text.subtitle, styles.subtitle]}>
                خلاصه وضعیت و مسیرهای سریع
              </Text>
            </View>
            <ThemeToggle variant="inline" />
          </View>

          <View style={styles.cardsRow}>
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cardLabel, { color: colors.muted }]}>
                پیشرفت امروز
              </Text>
              <Text style={[styles.cardValue, { color: colors.title }]}>
                68%
              </Text>
            </View>

            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cardLabel, { color: colors.muted }]}>
                زمان مطالعه
              </Text>
              <Text style={[styles.cardValue, { color: colors.title }]}>
                1ساعت 20دقیقه
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.actionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.actionTitle, { color: colors.title }]}>
              شروع تمرین روزانه
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.subtitle }]}>
              چند سوال کوتاه برای گرم شدن؟
            </Text>

            <Pressable
              android_ripple={{ color: "rgba(255,255,255,0.2)" }}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={styles.primaryButtonText}>شروع</Text>
            </Pressable>
          </View>

          <View style={styles.quickRow}>
            <Pressable
              android_ripple={{ color: "rgba(255,255,255,0.15)" }}
              style={({ pressed }) => [
                styles.quickCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={[styles.quickTitle, { color: colors.title }]}>
                آزمون
              </Text>
              <Text style={[styles.quickSubtitle, { color: colors.muted }]}>
                شروع سریع
              </Text>
            </Pressable>

<Pressable
  onPress={() => router.push("/tickets")}
  android_ripple={{ color: "rgba(255,255,255,0.15)" }}
  style={({ pressed }) => [
    styles.quickCard,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      opacity: pressed ? 0.9 : 1,
    },
  ]}
>
  <Text style={[styles.quickTitle, { color: colors.title }]}>
    گزارش
  </Text>
  <Text style={[styles.quickSubtitle, { color: colors.muted }]}>
    مشاهده روند
  </Text>
</Pressable>

          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.title }]}>
              بررسی کلی کاربر
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
              خلاصه عملکرد و وضعیت یادگیری
            </Text>
          </View>

          <View
            style={[
              styles.overviewCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.overviewSummary, { color: colors.subtitle }]}>
              روند کلی رو به رشد است و بیشترین فعالیت در هفته جاری ثبت شده است.
            </Text>

            <View style={styles.overviewRow}>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>
                امتیاز کلی
              </Text>
              <Text style={[styles.overviewValue, { color: colors.title }]}>
                8.6 از 10
              </Text>
            </View>
            <View
              style={[
                styles.overviewDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <View style={styles.overviewRow}>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>
                میانگین نمره
              </Text>
              <Text style={[styles.overviewValue, { color: colors.title }]}>
                74%
              </Text>
            </View>
            <View
              style={[
                styles.overviewDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <View style={styles.overviewRow}>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>
                ثبات هفتگی
              </Text>
              <Text style={[styles.overviewValue, { color: colors.title }]}>
                5 از 7 روز
              </Text>
            </View>
            <View
              style={[
                styles.overviewDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <View style={styles.overviewRow}>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>
                تکمیل دوره‌ها
              </Text>
              <Text style={[styles.overviewValue, { color: colors.title }]}>
                3 از 5
              </Text>
            </View>
            <View
              style={[
                styles.overviewDivider,
                { backgroundColor: colors.border },
              ]}
            />

            <View style={styles.overviewRow}>
              <Text style={[styles.overviewLabel, { color: colors.muted }]}>
                زمان مطالعه این هفته
              </Text>
              <Text style={[styles.overviewValue, { color: colors.title }]}>
                4ساعت 35دقیقه
              </Text>
            </View>
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    marginTop : 20,
    textAlign: "right",
  },
  subtitle: {
    textAlign: "right",
    marginBottom: 0,
    marginLeft: 0,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  card: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  cardLabel: {
    fontSize: 12,
    textAlign: "right",
  },
  cardValue: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
  },
  actionCard: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
  },
  actionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "right",
  },
  primaryButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  quickRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
  quickSubtitle: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "right",
  },
  sectionHeader: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "right",
  },
  manageGrid: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  manageCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    minHeight: 92,
    justifyContent: "space-between",
  },
  manageTitle: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  manageSubtitle: {
    marginTop: 6,
    fontSize: 11,
    textAlign: "right",
  },
  overviewCard: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  overviewSummary: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 8,
  },
  overviewRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  overviewLabel: {
    fontSize: 12,
    textAlign: "right",
  },
  overviewValue: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  overviewDivider: {
    height: 1,
    opacity: 0.7,
  },
});
