import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Starter from "../components/ui/starter";
import { sharedStyles } from "../components/ui/theme";
import Loading from "../components/ui/Loading";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={sharedStyles.screen}>
      {showLoading ? <Loading /> : <Starter />}
    </View>
  );
};

export default Index;
