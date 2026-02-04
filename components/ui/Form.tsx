import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { getTheme, sharedStyles } from "./theme";

const Form = () => {
  const systemTheme = useColorScheme();
  const { colors, text } = getTheme(systemTheme ?? "dark");

  return (
    <View
      style={[
        sharedStyles.centered,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={text.title}>Form</Text>
    </View>
  );
};

export default Form;
