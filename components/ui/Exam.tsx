import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { sharedStyles, useTheme } from "./theme";

const Exam = () => {
  const { colors, text } = useTheme();

  return (
    <View
      style={[
        sharedStyles.centered,
        { backgroundColor: colors.background },
      ]}
    >
      <Image
        source={require("../../assets/images/image (1).png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={text.title}>Exam</Text>
    </View>
  );
};

export default Exam;

const styles = StyleSheet.create({
  logo: {
    width: 260,
    height: 260,
    marginBottom: 24,
  },
});
