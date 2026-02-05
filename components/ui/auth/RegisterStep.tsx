import * as Notifications from "expo-notifications";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import RNOtpVerify from "react-native-otp-verify";
import { sharedStyles, useTheme } from "../theme";

type Props = {
  phone: string;
  onVerify: (otp: string) => Promise<void>;
};

const OTP_LENGTH = 6;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const OtpStep: React.FC<Props> = ({ phone, onVerify }) => {
  const { colors, text } = useTheme();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const windowHeight = Dimensions.get("window").height;

  const showOtpNotification = async (code: string) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "سلام 👋",
        body: `کد ورود شما: ${code}`,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    RNOtpVerify.getOtp()
      .then(() => {
        RNOtpVerify.addListener((message) => {
          const code = message.match(/\d{6}/)?.[0];
          if (code) {
            showOtpNotification(code);
            handleOtpChange(code);
          }
        });
      })
      .catch(() => {});

    return () => {
      RNOtpVerify.removeListener();
    };
  }, []);

  const scrollToInput = useCallback(() => {
    const firstInput = inputRefs.current[0];
    if (!firstInput || !contentRef.current || !scrollRef.current) return;

    firstInput.measureLayout(
      contentRef.current,
      (_x, y, _w, h) => {
        const inputBottom = y + h + 20;
        const visibleHeight = windowHeight - keyboardHeight;

        if (inputBottom > visibleHeight) {
          scrollRef.current.scrollTo({
            y: inputBottom - visibleHeight,
            animated: true,
          });
        }
      }
    );
  }, [keyboardHeight, windowHeight]);

  const focusInput = (index: number) => {
    const next = inputRefs.current[index];
    if (next) next.focus();
  };

  const handleDigitChange = async (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const nextOtp = otp.split("");
      nextOtp[index] = "";
      setOtp(nextOtp.join(""));
      setError(null);
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
    setOtp(joined);
    setError(null);

    if (writeIndex < OTP_LENGTH) {
      focusInput(writeIndex);
    }

    if (joined.length === OTP_LENGTH) {
      await submit(joined);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key !== "Backspace") return;
    const current = otp[index];
    if (!current && index > 0) {
      focusInput(index - 1);
    }
  };

  const submit = async (code = otp) => {
    if (code.length !== OTP_LENGTH) return;

    try {
      setLoading(true);
      await onVerify(code);
    } catch {
      setError("کد وارد شده معتبر نیست");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        sharedStyles.centered,
        {
          backgroundColor: colors.background,
          paddingBottom: keyboardHeight + 24,
        },
      ]}
    >
      <View ref={contentRef} style={styles.content}>
        <Image
          source={require("../../../assets/images/image (1).png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={text.title}>کد تأیید را وارد کن</Text>
        <Text style={[text.subtitle, { marginTop: 8 }]}>
          کد ارسال‌شده به شماره {phone}
        </Text>

        <View style={styles.otpRow}>
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <TextInput
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              autoFocus={index === 0}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index] || ""}
              onChangeText={(value) => handleDigitChange(index, value)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(index, nativeEvent.key)
              }
              onFocus={scrollToInput}
              textContentType={index === 0 ? "oneTimeCode" : "none"}
              autoComplete={index === 0 ? "sms-otp" : "off"}
              placeholder="●"
              placeholderTextColor={colors.muted}
              style={[
                styles.otpInput,
                {
                  borderColor: error ? colors.error : colors.border,
                  color: colors.text,
                },
              ]}
            />
          ))}
        </View>

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}

        <Pressable
          disabled={loading}
          onPress={() => submit()}
          style={[
            styles.button,
            { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? "در حال بررسی..." : "تأیید"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default OtpStep;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 320,
    height: 320,
  },
  otpRow: {
    width: "100%",
    maxWidth: 345,
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderRadius: 14,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    marginTop: 6,
    paddingVertical: 0  ,
    paddingHorizontal: 72,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    marginTop: 10,
    fontSize: 13,
  },
});
