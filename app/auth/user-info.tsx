import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import RegisterStep from "../../components/ui/auth/RegisterStep";
import { sharedStyles } from "../../components/ui/theme";
import { registerUser, type User } from "../../components/lib/api";
import { useUser } from "../../components/state/UserContext";

type UserInfoParams = {
  phone?: string | string[];
};

const UserInfoScreen = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const params = useLocalSearchParams<UserInfoParams>();

  const phoneParam =
    typeof params.phone === "string" ? params.phone : Array.isArray(params.phone) ? params.phone[0] : "";

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const completeLogin = useCallback(
    (user: User) => {
      setUser(user);
      router.replace("/dashboard");
    },
    [router, setUser],
  );

  const handleRegisterSubmit = useCallback(
    async (data: { fullName: string; fieldOfStudy: string }) => {
      if (!phoneParam) {
        setRegisterError("شماره موبایل در دسترس نیست. لطفاً از ابتدا شروع کن.");
        return;
      }

      setIsRegistering(true);
      setRegisterError(null);
      try {
        const user = await registerUser({
          fullName: data.fullName,
          fieldOfStudy: data.fieldOfStudy,
          phone: phoneParam,
        });
        completeLogin(user);
      } catch (err) {
        console.error("registerUser error", err);
        setRegisterError("ثبت‌نام با خطا مواجه شد. لطفاً دوباره تلاش کن.");
      } finally {
        setIsRegistering(false);
      }
    },
    [completeLogin, phoneParam],
  );

  return (
    <View style={sharedStyles.screen}>
      <RegisterStep
        phone={phoneParam}
        onSubmit={handleRegisterSubmit}
        loading={isRegistering}
        error={registerError}
      />
    </View>
  );
};

export default UserInfoScreen;

