import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "./theme";
import BottomNav from "./BottomNav";

const Roadmap = () => {
  const { colors, text } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      
      {/* Scrollable Full Screen Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[text.title, styles.title]}>
            نقشه راه یادگیری
          </Text>
          <Text style={[text.subtitle, styles.subtitle]}>
            مسیر پیشنهادی برای پیشرفت مرحله‌به‌مرحله
          </Text>
        </View>

        {/* Step 1 */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            مرحله ۱: مبانی
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            آشنایی با مفاهیم پایه، ساختار پروژه و اصول اولیه
          </Text>
        </View>

        {/* Step 2 */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            مرحله ۲: پیاده‌سازی
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            کار با کامپوننت‌ها، state، navigation و API
          </Text>
        </View>

        {/* Step 3 */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            مرحله ۳: حرفه‌ای
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            بهینه‌سازی، معماری، تست و آماده‌سازی برای بازار
          </Text>
        </View>
              {/* Step 3 */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            مرحله ۳: حرفه‌ای
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            بهینه‌سازی، معماری، تست و آماده‌سازی برای بازار
          </Text>
        </View>
              {/* Step 3 */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            مرحله ۳: حرفه‌ای
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            بهینه‌سازی، معماری، تست و آماده‌سازی برای بازار
          </Text>
        </View>
              {/* Step 3 */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            مرحله ۳: حرفه‌ای
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            بهینه‌سازی، معماری، تست و آماده‌سازی برای بازار
          </Text>
        </View>
        
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </View>
  );
};

export default Roadmap;

/* =======================
   Styles
   ======================= */
const styles = StyleSheet.create({
  screen: {
    flex: 1, // ✅ کل صفحه
  },

  scroll: {
    flex: 1, // ✅ ScrollView هم قد صفحه
  },

  content: {
    flexGrow: 1, // ✅ حتی با محتوای کم هم فول‌اسکرین
    padding: 20,
    paddingBottom: 180, // ✅ فاصله امن برای BottomNav
  },

  header: {
    marginBottom: 16,
  },

  title: {
    textAlign: "right",
  },

  subtitle: {
    textAlign: "right",
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "right",
  },

  stepDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right",
  },
});
