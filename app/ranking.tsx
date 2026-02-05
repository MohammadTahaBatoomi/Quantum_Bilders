import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Ranking from "../components/ui/Ranking";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Ranking />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ⬅️ مهم‌ترین خط کل پروژه
  },
});
