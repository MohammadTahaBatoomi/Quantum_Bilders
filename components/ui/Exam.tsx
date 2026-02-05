import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import { sharedStyles, useTheme } from "./theme";
import examData from "../../json/exam.json";
import { ApiError, clearExamDraft, getExamDraft, saveExamDraft, submitExam } from "../lib/api";
import { useUser } from "../state/UserContext";

const SPACING = 16;
const FIELD_TO_CATEGORY: Record<string, string> = {
  "ریاضی فیزیک": "engineering_math",
  "علوم تجربی": "medical",
  "علوم انسانی": "humanities",
  "شبکه و نرم افزار فنی حرفه ای": "computer_it",
  "مکانیک فنی حرفه ای": "engineering_math",
};

const Exam = () => {
  const { colors, text } = useTheme();
  const router = useRouter();
  const rootState = useRootNavigationState();
  const { user } = useUser();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!rootState?.key) return;
    if (user) return;
    Alert.alert("خطا", "لطفاً ابتدا اطلاعات فردی را تکمیل کنید.");
    router.replace("/form");
  }, [rootState?.key, router, user]);

  const selectedCategoryKey = useMemo(() => {
    const field = user?.fieldOfStudy?.trim();
    if (!field) return null;
    return FIELD_TO_CATEGORY[field] ?? null;
  }, [user?.fieldOfStudy]);

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryKey) return null;
    return examData.categories.find(
      (category) => category.key === selectedCategoryKey
    );
  }, [selectedCategoryKey]);

  useEffect(() => {
    setIndex(0);
    setAnswers({});
    setError("");
  }, [selectedCategoryKey]);

  const questions = useMemo(() => {
    const sourceCategories = selectedCategory
      ? [selectedCategory]
      : examData.categories;

    const flat = sourceCategories.flatMap((category) =>
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
  }, [selectedCategory]);

  useEffect(() => {
    if (!user || !rootState?.key) return;
    let isMounted = true;
    getExamDraft(user.id)
      .then((draft) => {
        if (!isMounted) return;
        if (!draft) return;
        if (draft.categoryKey && selectedCategoryKey && draft.categoryKey !== selectedCategoryKey) {
          return;
        }
        const restored = (draft.answers || []).reduce<Record<string, string>>((acc, item) => {
          if (item.questionKey && item.choice) {
            acc[item.questionKey] = item.choice;
          }
          return acc;
        }, {});
        setAnswers(restored);
        const firstUnanswered = questions.findIndex(
          (question) => !restored[question.questionKey]
        );
        if (firstUnanswered >= 0) {
          setIndex(firstUnanswered);
        } else if (questions.length > 0) {
          setIndex(questions.length - 1);
        }
      })
      .catch(() => undefined)
      .finally(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [questions.length, rootState?.key, selectedCategoryKey, user]);

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

  const submitAnswers = async () => {
    if (!user) return;

    const payload = questions.map((question) => ({
      questionKey: question.questionKey,
      choice: answers[question.questionKey],
    }));

    setSubmitting(true);
    try {
      const result = await submitExam({
        userId: user.id,
        categoryKey: selectedCategoryKey || undefined,
        answers: payload,
      });

      await clearExamDraft(user.id);

      const topChoice =
        result.analysis?.topChoice || result.result || "unknown";
      const analysisText =
        selectedCategory?.result_analysis?.[topChoice] ||
        "نتیجه شما ثبت شد.";

      const scoreText =
        typeof result.score === "number" && typeof result.total === "number"
          ? `امتیاز: ${result.score} از ${result.total}`
          : "";

      Alert.alert(
        "پایان آزمون",
        scoreText ? `${analysisText}\n${scoreText}` : analysisText
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "ارسال پاسخ‌ها با خطا مواجه شد.";
      Alert.alert("خطا", message);
    } finally {
      setSubmitting(false);
    }
  };

  const onNext = () => {
    if (!current) return;
    if (!selected) {
      setError("لطفاً یکی از گزینه‌ها را انتخاب کنید.");
      return;
    }

    if (index < total - 1) {
      const nextIndex = index + 1;
      const nextAnswers = {
        ...answers,
        [current.questionKey]: selected,
      };
      setIndex(nextIndex);
      setError("");
      if (user) {
        saveExamDraft({
          userId: user.id,
          categoryKey: selectedCategoryKey || undefined,
          answers: Object.entries(nextAnswers).map(([questionKey, choice]) => ({
            questionKey,
            choice,
          })),
          progressIndex: nextIndex,
          total,
        }).catch(() => undefined);
      }
      return;
    }

    if (submitting) return;
    void submitAnswers();
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
                    opacity: submitting ? 0.7 : 1,
                  },
                ]}
                onPress={onNext}
                disabled={submitting}
              >
                <Text style={styles.submitText}>
                  {submitting
                    ? "در حال ارسال..."
                    : index === total - 1
                      ? "پایان آزمون"
                      : "ثبت و بعدی"}
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
