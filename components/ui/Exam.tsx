import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { sharedStyles, useTheme } from "./theme";
import examData from "../../json/exam.json";

const Exam = () => {
  const { colors, text } = useTheme();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const questions = useMemo(() => {
    const flat = examData.categories.flatMap((category) =>
      category.questions.map((question) => ({
        ...question,
        categoryKey: category.key,
        categoryTitle: category.title,
        questionKey: `${category.key}-${question.id}`,
      }))
    );

    for (let i = flat.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [flat[i], flat[j]] = [flat[j], flat[i]];
    }

    return flat;
  }, []);

  const current = questions[index];
  const total = questions.length;
  const selected = current ? answers[current.questionKey] : "";

  const optionList = current
    ? (Object.entries(current.options) as Array<[string, string]>)
    : [];

  const onSelect = (key: string) => {
    if (!current) return;
    setError("");
    setAnswers((prev) => ({
      ...prev,
      [current.questionKey]: key,
    }));
  };

  const onNext = () => {
    if (!current) return;
    if (!selected) {
      setError("لطفاً یکی از گزینه‌ها را انتخاب کنید.");
      return;
    }

    if (index < total - 1) {
      setIndex((prev) => prev + 1);
      setError("");
      return;
    }

    Alert.alert("پایان آزمون", "پاسخ‌ها با موفقیت ثبت شد.");
  };

  const onBack = () => {
    if (index === 0) return;
    setIndex((prev) => prev - 1);
    setError("");
  };

  return (
    <View
      style={[
        sharedStyles.centered,
        { backgroundColor: colors.background },
      ]}
    >
      <Image
        source={require("../../assets/images/image (1).png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={text.title}>آزمون</Text>

      {!!current && (
        <>
          <Text style={[styles.counter, { color: colors.muted }]}>
            سوال {index + 1} از {total}
          </Text>

          <Text style={[styles.question, { color: colors.title }]}>
            {current.question}
          </Text>

          <View style={styles.optionsGrid}>
            {optionList.map(([key, label]) => {
              const isSelected = selected === key;
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.option,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.card,
                      borderColor: isSelected
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                  onPress={() => onSelect(key)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? "#ffffff" : colors.text },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {!!error && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          )}

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: index === 0 ? 0.5 : pressed ? 0.85 : 1,
                },
              ]}
              onPress={onBack}
              disabled={index === 0}
            >
              <Text style={[styles.backText, { color: colors.text }]}>
                قبلی
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              onPress={onNext}
            >
              <Text style={styles.submitText}>
                {index === total - 1 ? "پایان آزمون" : "ثبت و بعدی"}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default Exam;

const styles = StyleSheet.create({
  logo: {
    width: 260,
    height: 260,
    marginBottom: 24,
  },
  counter: {
    fontSize: 13,
    marginBottom: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    width: "100%",
    marginBottom: 16,
    lineHeight: 26,
  },
  optionsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  option: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 14,
    textAlign: "right",
  },
  errorText: {
    width: "100%",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "right",
  },
  actionsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  backButton: {
    width: "40%",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  backText: {
    fontSize: 15,
    fontWeight: "700",
  },
  submitButton: {
    width: "56%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
