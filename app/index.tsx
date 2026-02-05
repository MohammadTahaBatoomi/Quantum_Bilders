import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import Loading from "../components/ui/Loading";
import { sharedStyles } from "../components/ui/theme";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/starter");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={sharedStyles.screen}>
      <Loading />
    </View>
  );
};

export default Index;
