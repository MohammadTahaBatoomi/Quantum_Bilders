import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "./theme";
import BottomNav from "./BottomNav";

const Roadmap = () => {
  const { colors, text } = useTheme();

  const steps = [
    {
      title: "مرحله ۱: یادگیری مبانی",
      desc: "سینتکس پایه، متغیرها، انواع داده، شرط‌ها، حلقه‌ها و توابع داخلی پایتون",
    },
    {
      title: "مرحله ۲: ساختمان داده و الگوریتم",
      desc: "لیست‌ها، دیکشنری‌ها، استک، صف، درخت‌ها، بازگشت و الگوریتم‌های مرتب‌سازی",
    },
    {
      title: "مرحله ۳: پایتون پیشرفته",
      desc: "برنامه‌نویسی شی‌گرا، کلاس‌ها، ارث‌بری، دکوراتورها، ماژول‌ها و Regex",
    },
    {
      title: "مرحله ۴: فریم‌ورک‌ها",
      desc: "Django، FastAPI، Flask و برنامه‌نویسی همزمان و غیرهمزمان",
    },
    {
      title: "مرحله ۵: تست و دواپس",
      desc: "تست‌نویسی با pytest، تایپ ایستا، آماده‌سازی پروژه و مفاهیم DevOps",
    },    {
      title: "مرحله ۵: تست و دواپس",
      desc: "تست‌نویسی با pytest، تایپ ایستا، آماده‌سازی پروژه و مفاهیم DevOps",
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[text.title, styles.title]}>
            دستیار هوشمند یادگیری پایتون
          </Text>
          <Text style={[text.subtitle, styles.subtitle]}>
            همراه شخصی‌سازی‌شدهٔ شما برای یادگیری مرحله‌به‌مرحله
          </Text>
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            AI Tutor – roadmap.sh
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            این نقشه راه به شما کمک می‌کند مفاهیم پایتون را یاد بگیرید، پیشرفت خود
            را دنبال کنید، منابع مناسب پیدا کنید و برای بازار کار آماده شوید.
          </Text>
        </View>

        {/* Steps */}
        {steps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: colors.title }]}>
              {step.title}
            </Text>
            <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
              {step.desc}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
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
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 180,
  },

  header: {
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
