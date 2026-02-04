import React from "react";
import { View } from "react-native";
import Exam from "../components/ui/Exam";
import { sharedStyles } from "../components/ui/theme";

const ExamScreen = () => {
  return (
    <View style={sharedStyles.screen}>
      <Exam />
    </View>
  );
};

export default ExamScreen;
