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
  phone: string;
  onChangePhone: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
};

export const PhoneStep: React.FC<Props> = ({
  phone,
  onChangePhone,
  onSubmit,
  loading,
  error,
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
      
      <Text style={text.title}>شماره موبایل</Text>
      <Text         style={[
          text.subtitle,

        ]}>
        برای شروع، فقط به شماره موبایلت نیاز داریم.
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
        keyboardType="phone-pad"
        placeholder="مثلاً 09123456789"
        placeholderTextColor={colors.muted}
        value={phone}
        onChangeText={onChangePhone}
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
        <Text style={styles.buttonText}>{loading ? "در حال پردازش..." : "ادامه"}</Text>
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
  input: {
    width: "100%",
    maxWidth: 360,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 14,
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
    paddingHorizontal: 85
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    marginLeft: 210
  },
});

export default PhoneStep;
