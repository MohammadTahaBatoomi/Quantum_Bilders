import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { sharedStyles, useTheme } from "./theme";

const Loading = () => {
  const { colors } = useTheme();

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
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  logo: {
    width: 260,
    height: 260,
  },
});
