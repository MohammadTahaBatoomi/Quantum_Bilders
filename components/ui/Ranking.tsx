import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";

/* ---------------- Mock Data ---------------- */

const DATA = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? "محمد طاها 👑" : `کاربر ${i + 1}`,
  field: "برنامه‌نویسی",
  years: 2 + (i % 5),
  hours: 120 + i * 3,
  score: 1500 - i * 10,
}));

/* ---------------- Ranking Item ---------------- */

const RankingItem = ({ item }) => {
  const isTop = item.id === 1;

  return (
    <View style={[styles.card, isTop && styles.topCard]}>
      {/* Right side (Rank + Info) */}
      <View style={styles.rightSection}>
        <Text style={[styles.rank, isTop && styles.topText]}>
          #{item.id}
        </Text>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            حوزه: {item.field} | سابقه: {item.years} سال | تایم: {item.hours} ساعت
          </Text>
        </View>
      </View>

      {/* Left side (Score) */}
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );
};

/* ---------------- Main Screen ---------------- */

const Ranking = () => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>🏆 رنکینگ برترین‌ها</Text>
            <Text style={styles.subtitle}>
              ۱۰۰ نفر اول بر اساس امتیاز
            </Text>
          </View>
        }
        renderItem={({ item }) => <RankingItem item={item} />}
      />

      {/* CTA Button */}
      <TouchableOpacity activeOpacity={0.85} style={styles.ctaButton}>
        <Text style={styles.ctaText}>🚀 ارتقای رتبه من</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Ranking;

/* =======================
   Styles
   ======================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f7f9",
  },

  content: {
    padding: 20,
    paddingBottom: 140,
  },

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "right",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "right",
  },

  card: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
  },

  topCard: {
    borderColor: "#f59e0b",
    backgroundColor: "#fff7ed",
  },

  rightSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
  },

  rank: {
    width: 40,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    color: "#111827",
  },

  topText: {
    color: "#f59e0b",
  },

  info: {
    marginRight: 12,
    flexShrink: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
    color: "#111827",
  },

  meta: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    color: "#6b7280",
  },

  score: {
    fontSize: 16,
    fontWeight: "900",
    color: "#2563eb",
    minWidth: 60,
    textAlign: "left",
  },

  ctaButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },

  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});
