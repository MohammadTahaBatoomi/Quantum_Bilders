import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useTheme } from "./theme";
import BottomNav from "./BottomNav";

export default function Tickets() {
  const { colors, mode } = useTheme();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submitTicket = () => {
    if (!title || !message) return;

    // 🔴 اینجا بعداً API واقعی می‌خوره
    setSuccess(true);
    setTitle("");
    setMessage("");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.title }]}>
          ارسال انتقاد یا پیشنهاد
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.muted }]}>
            عنوان
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="مثلاً: مشکل در داشبورد"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />

          <Text style={[styles.label, { color: colors.muted }]}>
            توضیحات
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="متن انتقاد یا پیشنهاد خود را بنویسید..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={5}
            style={[
              styles.textarea,
              {
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />

          <Pressable
            onPress={submitTicket}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={styles.buttonText}>
              ارسال پیام
            </Text>
          </Pressable>

          {success && (
            <View
              style={[
                styles.successBox,
                { backgroundColor: colors.success },
              ]}
            >
              <Text style={styles.successText}>
                ✅ پیام شما با موفقیت ثبت شد و در حال بررسی می‌باشد
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingVertical: 230,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "right",
  },
  card: {
    borderRadius: 18,
    paddingVertical:35,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical:18,
    marginBottom: 16,
    textAlign: "right",
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 140,
    textAlignVertical: "top",
    textAlign: "right",
    marginBottom: 20,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  successBox: {
    marginTop: 16,
    borderRadius: 12,
    padding: 12,
  },
  successText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "right",
  },
});
