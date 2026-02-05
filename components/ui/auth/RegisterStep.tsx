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

/* ✅ Notification handler (الزامی در Expo) */
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
  const inputRef = useRef<TextInput>(null);

  const windowHeight = Dimensions.get("window").height;

  /* ─────────────── Notification (ALL HERE) ─────────────── */
  const showOtpNotification = async (code: string) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "سلام 👋",
        body: `کد ورود شما: ${code}`,
      },
      trigger: null, // فوری
    });
  };

  /* ─────────────── Keyboard ─────────────── */
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

  /* ─────────────── Android OTP Reader ─────────────── */
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

  /* ─────────────── Scroll to Input ─────────────── */
  const scrollToInput = useCallback(() => {
    if (!inputRef.current || !contentRef.current || !scrollRef.current) return;

    inputRef.current.measureLayout(
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

  /* ─────────────── OTP Logic ─────────────── */
  const handleOtpChange = async (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(cleaned);
    setError(null);

    if (cleaned.length === OTP_LENGTH) {
      await submit(cleaned);
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

  /* ─────────────── Render ─────────────── */
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

        <TextInput
          ref={inputRef}
          autoFocus
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          value={otp}
          onChangeText={handleOtpChange}
          onFocus={scrollToInput}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          placeholder="● ● ● ● ● ●"
          placeholderTextColor={colors.muted}
          style={[
            styles.input,
            {
              borderColor: error ? colors.error : colors.border,
              color: colors.text,
            },
          ]}
        />

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

/* ─────────────── Styles ─────────────── */
const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 320,
    height: 320,
  },
  input: {
    width: "100%",
    maxWidth: 345,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 18,
    fontSize: 16,
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
