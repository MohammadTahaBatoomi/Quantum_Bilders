import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { sharedStyles } from "../../components/ui/theme";
import CourseExam from "../../components/ui/CourseExam";

const CourseExamScreen = () => {
  const params = useLocalSearchParams<{ course?: string }>();
  const courseTitle = typeof params.course === "string" ? params.course : undefined;

  return (
    <View style={sharedStyles.screen}>
      <CourseExam courseTitle={courseTitle} />
    </View>
  );
};

export default CourseExamScreen;
