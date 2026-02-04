import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { sharedStyles, useTheme } from "./theme";
import examData from "../../json/exam.json";

const SPACING = 16;

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
        { backgroundColor: colors.background, paddingTop: 24 },
      ]}
    >
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/image (1).png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={text.title}>ازمون استعداد یابی </Text>
        </View>
      </View>


      {!!current && (
        <>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.counter, { color: colors.muted }]}>
              سوال {index + 1} از {total}
            </Text>

            <Text style={[styles.question, { color: colors.title}]}>
              {current.question}
            </Text>

            <Text style={[styles.subTitle, { color: colors.muted }]}>
            {examData.instruction}
          </Text>

            <View style={styles.optionsGrid}>
              {optionList.map(([key, label]) => {
                const isSelected = selected === key;
                return (
                  <Pressable
                    key={key}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.background,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.border,
                        transform: [{ scale: pressed ? 0.99 : 1 }],
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
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    opacity: index === 0 ? 0.5 : pressed ? 0.9 : 1,
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
          </View>
        </>
      )}
    </View>
  );
};

export default Exam;

const styles = StyleSheet.create({
  headerRow: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent : "center",
    marginRight:40
  },
  headerText: {
    flex: 1,
    alignItems: "flex-end",
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 10
  },
  subTitle: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "right",
    marginBottom: 15
  },
  card: {
    width: "100%",
    borderRadius: 20,
    padding: SPACING,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  counter: {
    fontSize: 13,
    marginBottom: 6,
  },
  question: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "right",
    width: "100%",
    marginBottom: SPACING,
    lineHeight: 26,
  },
  optionsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  option: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 64,
    justifyContent: "center",
  },
  optionText: {
    fontSize: 14,
    textAlign: "right",
  },
  errorText: {
    width: "100%",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "right",
  },
  actionsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING / 2,
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
