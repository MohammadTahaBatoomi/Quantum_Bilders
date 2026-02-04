import React from "react";
import { View } from "react-native";
import Form from "../components/ui/Form";
import { sharedStyles } from "../components/ui/theme";

const FormScreen = () => {
  return (
    <View style={sharedStyles.screen}>
      <Form />
    </View>
  );
};

export default FormScreen;
