import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useTheme } from "./theme";

const NAV_ITEMS = [
  { label: "آزمون", icon: "school", route: "/exam" },
  { label: "داشبورد", icon: "home", route: "/dashboard" },
];

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.route;
        return (
          <Pressable
            key={item.route}
            onPress={() => router.replace(item.route)}
            style={({ pressed }) => [
              styles.item,
              isActive && { backgroundColor: colors.primarySoft },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={isActive ? colors.primary : colors.muted}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? colors.primary : colors.muted },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  item: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
});
