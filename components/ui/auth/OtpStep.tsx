import * as Notifications from "expo-notifications";
import React from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { sharedStyles, useTheme } from "../theme";

const OTP_LENGTH = 6;

type Props = {
  otp: string;
  onChangeOtp: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
  phone: string;
  debugOtp?: string | null;
};

export const OtpStep: React.FC<Props> = ({
  otp,
  onChangeOtp,
  onSubmit,
  loading,
  error,
  phone,
  debugOtp,
}) => {
  const { colors, text } = useTheme();
  const scrollRef = React.useRef<ScrollView>(null);
  const contentRef = React.useRef<View>(null);
  const inputRefs = React.useRef<Array<TextInput | null>>([]);
  const lastSubmittedOtp = React.useRef<string>("");
  const otpRef = React.useRef<string>(otp);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const windowHeight = Dimensions.get("window").height;

  React.useEffect(() => {
    otpRef.current = otp;
  }, [otp]);

  React.useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  React.useEffect(() => {
    const extractOtp = (text?: string | null) => text?.match(/\d{6}/)?.[0];

    const handleNotification = (notification: Notifications.Notification) => {
      const title = notification.request.content.title ?? "";
      const body = notification.request.content.body ?? "";
      const code = extractOtp(`${title} ${body}`);
      if (!code) return;
      if (otpRef.current.length >= OTP_LENGTH) return;
      onChangeOtp(code);
    };

    const receivedSub = Notifications.addNotificationReceivedListener(handleNotification);
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotification(response.notification);
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [onChangeOtp]);

  React.useEffect(() => {
    if (otp.length < OTP_LENGTH) {
      lastSubmittedOtp.current = "";
      return;
    }

    if (otp.length === OTP_LENGTH && !loading && otp !== lastSubmittedOtp.current) {
      lastSubmittedOtp.current = otp;
      onSubmit();
    }
  }, [otp, loading, onSubmit]);

  const scrollToInput = React.useCallback(() => {
    const firstInput = inputRefs.current[0];
    if (!firstInput || !contentRef.current || !scrollRef.current) return;

    firstInput.measureLayout(
      contentRef.current,
      (_x, y, _w, h) => {
        const extra = 20;
        const inputBottom = y + h + extra;
        const visibleHeight = windowHeight - keyboardHeight;
        if (inputBottom > visibleHeight) {
          const targetY = Math.max(0, inputBottom - visibleHeight);
          scrollRef.current?.scrollTo({ y: targetY, animated: true });
        }
      },
      () => {}
    );
  }, [keyboardHeight, windowHeight]);

  const focusInput = (index: number) => {
    const next = inputRefs.current[index];
    if (next) next.focus();
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextOtp = otp.split("");
      nextOtp[index] = "";
      onChangeOtp(nextOtp.join("").slice(0, OTP_LENGTH));
      return;
    }

    const digits = cleaned.split("").slice(0, OTP_LENGTH);
    const nextOtp = otp.split("");
    let writeIndex = index;
    digits.forEach((digit) => {
      if (writeIndex < OTP_LENGTH) {
        nextOtp[writeIndex] = digit;
        writeIndex += 1;
      }
    });

    const joined = nextOtp.join("").slice(0, OTP_LENGTH);
    onChangeOtp(joined);

    if (writeIndex < OTP_LENGTH) {
      focusInput(writeIndex);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key !== "Backspace") return;
    const current = otp[index];
    if (!current && index > 0) {
      focusInput(index - 1);
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        sharedStyles.centered,
        {
          backgroundColor: colors.background,
          paddingBottom: keyboardHeight ? keyboardHeight + 24 : 24,
        },
      ]}
    >
      <View ref={contentRef} style={styles.content}>
        <Image
          source={require("../../../assets/images/image (1).png")}
          style={styles.logo}
          resizeMode="contain"
        />

      <Text style={text.title}>کد تایید رو وارد کن </Text>
      <Text style={[text.subtitle, { marginTop: 8 }]}>
        یک کد تأیید برای شماره {phone} برات ارسال کردیم
      </Text>
      <View style={styles.otpRow}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            autoFocus={index === 0}
            style={[
              styles.otpInput,
              {
                borderColor: error ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            placeholder=""
            placeholderTextColor={colors.muted}
            value={otp[index] || ""}
            onChangeText={(value) => handleDigitChange(index, value)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(index, nativeEvent.key)
            }
            onFocus={scrollToInput}
            textContentType={index === 0 ? "oneTimeCode" : "none"}
            autoComplete={index === 0 ? "sms-otp" : "off"}
          />
        ))}
      </View>

      {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

      <Pressable
        android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.primary,
            opacity: loading ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "تایبد" : "تایید"}</Text>
      </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 350,
    height: 350,
  },
  otpRow: {
    width: "100%",
    maxWidth: 350,
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 80,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 85,
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    marginLeft: 210,
  },
});

export default OtpStep;
