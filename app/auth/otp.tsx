import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import OtpStep from "../../components/ui/auth/OtpStep";
import { sharedStyles } from "../../components/ui/theme";
import { getUserByPhone, type User } from "../../components/lib/api";
import { useUser } from "../../components/state/UserContext";

type OtpParams = {
  phone?: string | string[];
  otp?: string | string[];
};

const OtpScreen = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const params = useLocalSearchParams<OtpParams>();

  const phoneParam =
    typeof params.phone === "string" ? params.phone : Array.isArray(params.phone) ? params.phone[0] : "";
  const expectedOtp =
    typeof params.otp === "string" ? params.otp : Array.isArray(params.otp) ? params.otp[0] : "";

  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  const completeLogin = useCallback(
    (user: User) => {
      setUser(user);
      router.replace("/dashboard");
    },
    [router, setUser],
  );

  const handleOtpSubmit = useCallback(async () => {
    if (!phoneParam || !expectedOtp) {
      setOtpError("اطلاعات لازم برای تأیید موجود نیست. لطفاً از ابتدا شروع کن.");
      return;
    }

    if (otpInput.trim() !== expectedOtp) {
      setOtpError("کد وارد شده اشتباه است.");
      return;
    }

    setOtpError(null);
    setIsCheckingUser(true);

    try {
      const existingUser = await getUserByPhone(phoneParam);
      if (existingUser) {
        completeLogin(existingUser);
      } else {
        router.replace({ pathname: "/auth/user-info", params: { phone: phoneParam } });
      }
    } catch (err) {
      console.error("getUserByPhone error", err);
      // در صورت خطا، کاربر را به مرحله ثبت‌نام هدایت می‌کنیم
      router.replace({ pathname: "/auth/user-info", params: { phone: phoneParam } });
    } finally {
      setIsCheckingUser(false);
    }
  }, [expectedOtp, otpInput, phoneParam, completeLogin, router]);

  return (
    <View style={sharedStyles.screen}>
      <OtpStep
        phone={phoneParam}
        otp={otpInput}
        onChangeOtp={(value) => {
          setOtpInput(value);
          if (otpError) {
            setOtpError(null);
          }
        }}
        onSubmit={handleOtpSubmit}
        loading={isCheckingUser}
        error={otpError}
        debugOtp={expectedOtp}
      />
    </View>
  );
};

export default OtpScreen;

