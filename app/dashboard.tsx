import React from "react";
import { View } from "react-native";
import Dashboard from "../components/ui/Dashboard";
import { sharedStyles } from "../components/ui/theme";

const DashboardScreen = () => {
  return (
    <View style={sharedStyles.screen}>
      <Dashboard />
    </View>
  );
};

export default DashboardScreen;
