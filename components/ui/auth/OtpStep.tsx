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
  const inputRef = React.useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const windowHeight = Dimensions.get("window").height;

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

  const scrollToInput = React.useCallback(() => {
    if (!inputRef.current || !contentRef.current || !scrollRef.current) return;

    inputRef.current.measureLayout(
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
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
        ]}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="کد ۶ رقمی"
        placeholderTextColor={colors.muted}
        value={otp}
        onChangeText={onChangeOtp}
        onFocus={scrollToInput}
      />

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
        <Text style={styles.buttonText}>{loading ? "در حال بررسی..." : "تایید"}</Text>
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
    // marginBottom: 40,
  },
  input: {
    width: "100%",
    maxWidth: 350,
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 4,
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
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
