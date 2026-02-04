import { View, StyleSheet } from "react-native";
import React from "react";
import Starter from "../components/starter";

const Index = () => {
  return (
    <View style={styles.container}>
      <Starter />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,         
    width: "100%",    
    height: "100%",  
  },
});
