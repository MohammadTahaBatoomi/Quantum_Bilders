import * as Notifications from "expo-notifications";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import PhoneStep from "../../components/ui/auth/PhoneStep";
import { sharedStyles } from "../../components/ui/theme";

const generateFakeOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const normalizePhone = (value: string) => {
  const raw = String(value ?? "").trim();
  const digits = raw.replace(/\D+/g, "");

  if (digits.startsWith("0098") && digits.length >= 14) {
    return `0${digits.slice(4)}`;
  }
  if (digits.startsWith("98") && digits.length >= 12) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith("0")) {
    return digits;
  }

  return digits;
};

const validatePhone = (value: string): string | null => {
  const phone = normalizePhone(value);
  if (!phone) {
    return "شماره موبایل الزامی است.";
  }
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 10) {
    return "شماره موبایل وارد شده معتبر نیست.";
  }
  return null;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const PhoneScreen = () => {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showOtpNotification = useCallback(async (code: string) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "پیامک شبیه‌سازی‌شده",
        body: `کد تأیید شما: ${code}`,
      },
      trigger: null,
    });
  }, []);

  const handlePhoneSubmit = useCallback(() => {
    if (submitting) return;

    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }

    setPhoneError(null);
    setSubmitting(true);

    const normalized = normalizePhone(phone);
    const otp = generateFakeOtp();

    // Simulated SMS via local notification
    showOtpNotification(otp).catch(() => {});

    router.push({
      pathname: "/auth/otp",
      params: { phone: normalized, otp },
    });

    setSubmitting(false);
  }, [phone, router, showOtpNotification, submitting]);

  return (
    <View style={sharedStyles.screen}>
      <PhoneStep
        phone={phone}
        onChangePhone={(value) => {
          setPhone(value);
          if (phoneError) {
            setPhoneError(null);
          }
        }}
        onSubmit={handlePhoneSubmit}
        loading={submitting}
        error={phoneError}
      />
    </View>
  );
};

export default PhoneScreen;
