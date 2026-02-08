import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useUser } from "../components/state/UserContext";
import Loading from "../components/ui/Loading";
import { sharedStyles } from "../components/ui/theme";

const StarterScreen = () => {
  const router = useRouter();
  const { user, isHydrated } = useUser();

  useEffect(() => {
    if (!isHydrated) return;
    router.replace("/auth/phone");
  }, [isHydrated, router, user]);

  return (
    <View style={sharedStyles.screen}>
      <Loading />
    </View>
  );
};

export default StarterScreen;
