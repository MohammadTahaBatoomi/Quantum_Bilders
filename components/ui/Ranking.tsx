import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "./theme";
import BottomNav from "./BottomNav";

/* ---------------- Mock Data ---------------- */

const DATA = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? "محمد طاها 👑" : `کاربر ${i + 1}`,
  field: "برنامه‌نویسی",
  years: 2 + (i % 5),
  hours: 120 + i * 3,
  score: 1500 - i * 10,
}));

/* ---------------- Item ---------------- */

const RankingItem = ({ item, colors }) => {
  const isTop = item.id === 1;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isTop ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.rank,
          { color: isTop ? colors.primary : colors.title },
        ]}
      >
        #{item.id}
      </Text>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.title }]}>
          {item.name}
        </Text>

        <Text style={[styles.meta, { color: colors.subtitle }]}>
          حوزه: {item.field} | سابقه: {item.years} سال | تایم: {item.hours} ساعت
        </Text>
      </View>

      <Text style={[styles.score, { color: colors.primary }]}>
        {item.score}
      </Text>
    </View>
  );
};


const Ranking = ({ mode, toggleTheme }) => {
  const { colors, text } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
      />

      {/* Scrollable Content */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text style={[text.title, styles.title]}>
                🏆 رنکینگ برترین‌ها
              </Text>

            </View>

            <Text style={[text.subtitle, styles.subtitle]}>
              ۱۰۰ نفر اول بر اساس امتیاز
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RankingItem item={item} colors={colors} />
        )}
      />

      {/* CTA Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.ctaButton,
          { backgroundColor: colors.primary },
        ]}
      >
        <Text style={styles.ctaText}>🚀 ارتقای رتبه من</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
};

export default Ranking;

/* =======================
   Styles (Roadmap Style)
   ======================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 200, // فضای امن برای CTA + BottomNav
  },

  header: {
    marginBottom: 16,
  },

  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    textAlign: "right",
  },

  subtitle: {
    marginTop: 6,
    textAlign: "right",
  },

  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  rank: {
    width: 40,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  info: {
    flex: 1,
    marginHorizontal: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
  },

  meta: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },

  score: {
    fontSize: 15,
    fontWeight: "800",
  },

  ctaButton: {
    position: "absolute",
    bottom:  120, // بالای BottomNav
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
