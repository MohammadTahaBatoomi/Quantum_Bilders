import React from "react";
import { View } from "react-native";
import Starter from "../components/ui/starter";
import { sharedStyles } from "../components/ui/theme";

const StarterScreen = () => {
  return (
    <View style={sharedStyles.screen}>
      <Starter />
    </View>
  );
};

export default StarterScreen;

