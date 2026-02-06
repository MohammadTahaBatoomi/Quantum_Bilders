import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import BottomNav from "./BottomNav";
import { useTheme } from "./theme";
import azmonData from "../../json/azmon.json";

type OptionKey = "A" | "B" | "C" | "D";

type QuizQuestion = {
  id: number;
  question: string;
  options: Record<OptionKey, string>;
  answer?: OptionKey;
};

type QuizData = {
  exam_title: string;
  total_questions?: number;
  questions: QuizQuestion[];
};

const CourseExam = ({ courseTitle }: { courseTitle?: string }) => {
  const { colors, text } = useTheme();
  const router = useRouter();
  const data = azmonData as QuizData;

  const questions = React.useMemo(() => data.questions ?? [], [data.questions]);
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, OptionKey>>({});

  const current = questions[index] ?? null;
  const currentAnswer = current ? answers[String(current.id)] : undefined;

  const gradedQuestions = React.useMemo(
    () => questions.filter((q) => !!q.answer).length,
    [questions]
  );

  const stats = React.useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let answered = 0;
    for (const q of questions) {
      const selected = answers[String(q.id)];
      if (!selected) continue;
      answered += 1;
      if (!q.answer) continue;
      if (selected === q.answer) correct += 1;
      else wrong += 1;
    }
    const correctPct = gradedQuestions
      ? Math.round((correct / gradedQuestions) * 100)
      : 0;
    const wrongPct = gradedQuestions
      ? Math.round((wrong / gradedQuestions) * 100)
      : 0;
    return { correct, wrong, answered, correctPct, wrongPct };
  }, [answers, gradedQuestions, questions]);

  const showResult = questions.length > 0 && index >= questions.length;

  const onSelect = (key: OptionKey) => {
    if (!current) return;
    if (currentAnswer) return;
    setAnswers((prev) => ({ ...prev, [String(current.id)]: key }));
  };

  const onNext = () => {
    if (showResult) return;
    if (!current) return;
    if (!currentAnswer) return;
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) setIndex(questions.length);
    else setIndex(nextIndex);
  };

  const onBack = () => {
    if (index <= 0) return;
    setIndex((prev) => prev - 1);
  };

  const onRestart = () => {
    setAnswers({});
    setIndex(0);
  };

  const renderOption = (key: OptionKey, label: string) => {
    if (!current) return null;
    const selected = currentAnswer === key;
    const hasAnswered = !!currentAnswer;
    const correctKey = current.answer;
    const isCorrect = !!correctKey && key === correctKey;
    const isWrongSelected = selected && !!correctKey && key !== correctKey;

    const bg =
      hasAnswered && isCorrect
        ? colors.successSoft
        : hasAnswered && isWrongSelected
          ? colors.dangerSoft
          : colors.card;

    const border =
      hasAnswered && isCorrect
        ? colors.success
        : hasAnswered && isWrongSelected
          ? colors.danger
          : selected
            ? colors.primary
            : colors.border;

    return (
      <Pressable
        key={key}
        disabled={hasAnswered}
        onPress={() => onSelect(key)}
        style={({ pressed }) => [
          styles.option,
          { backgroundColor: bg, borderColor: border },
          pressed && !hasAnswered && { opacity: 0.92 },
        ]}
      >
        <View style={styles.optionRow}>
          <View style={[styles.optionKey, { backgroundColor: colors.toggleBg }]}>
            <Text style={[styles.optionKeyText, { color: colors.title }]}>
              {key}
            </Text>
          </View>
          <Text style={[styles.optionText, { color: colors.text }]}>{label}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[text.title, styles.title]}>
            {courseTitle ? `آزمون ${courseTitle}` : data.exam_title}
          </Text>
          <Text style={[text.subtitle, styles.subtitle]}>
            {showResult
              ? "نتیجه آزمون"
              : `سوال ${Math.min(index + 1, questions.length)} از ${questions.length}`}
          </Text>
        </View>

        {questions.length === 0 ? (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.title }]}>
              سوالی پیدا نشد
            </Text>
            <Text style={[styles.cardBody, { color: colors.subtitle }]}>
              فایل `json/azmon.json` خالی است یا فرمتش درست نیست.
            </Text>
          </View>
        ) : showResult ? (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.title }]}>
              نتیجه نهایی
            </Text>

            <View style={styles.statRow}>
              <View
                style={[
                  styles.statPill,
                  { backgroundColor: colors.successSoft, borderColor: colors.success },
                ]}
              >
                <Text style={[styles.statText, { color: colors.success }]}>
                  درست: {stats.correct} ({stats.correctPct}%)
                </Text>
              </View>
              <View
                style={[
                  styles.statPill,
                  { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
                ]}
              >
                <Text style={[styles.statText, { color: colors.danger }]}>
                  غلط: {stats.wrong} ({stats.wrongPct}%)
                </Text>
              </View>
            </View>

            <Text style={[styles.meta, { color: colors.muted }]}>
              پاسخ داده‌شده: {stats.answered} از {questions.length}
            </Text>
            <Text style={[styles.meta, { color: colors.muted }]}>
              سوالات قابل نمره‌دهی (دارای جواب): {gradedQuestions} از{" "}
              {questions.length}
            </Text>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={onRestart}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.primaryButtonText}>شروع دوباره</Text>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  { borderColor: colors.border, backgroundColor: colors.card },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.title }]}>
                  برگشت
                </Text>
              </Pressable>
            </View>
          </View>
        ) : current ? (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.question, { color: colors.title }]}>
              {current.question}
            </Text>

            <View style={styles.options}>
              {(Object.entries(current.options) as Array<[OptionKey, string]>).map(
                ([key, label]) => renderOption(key, label)
              )}
            </View>

            {currentAnswer ? (
              <View style={styles.feedback}>
                {!current.answer ? (
                  <Text style={[styles.feedbackText, { color: colors.muted }]}>
                    برای این سوال هنوز جواب صحیح در `azmon.json` مشخص نشده.
                  </Text>
                ) : currentAnswer === current.answer ? (
                  <Text style={[styles.feedbackText, { color: colors.success }]}>
                    درست بود.
                  </Text>
                ) : (
                  <Text style={[styles.feedbackText, { color: colors.danger }]}>
                    غلط بود. جواب صحیح: {current.answer}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={[styles.hint, { color: colors.muted }]}>
                یکی از گزینه‌ها را انتخاب کن (فقط یک‌بار).
              </Text>
            )}

            <View style={styles.actionsRow}>
              <Pressable
                disabled={index === 0}
                onPress={onBack}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    opacity: index === 0 ? 0.5 : 1,
                  },
                  pressed && index !== 0 && { opacity: 0.92 },
                ]}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.title }]}>
                  قبلی
                </Text>
              </Pressable>

              <Pressable
                disabled={!currentAnswer}
                onPress={onNext}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: !currentAnswer ? 0.5 : 1,
                  },
                  pressed && currentAnswer && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {index === questions.length - 1 ? "پایان" : "بعدی"}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <BottomNav />
    </View>
  );
};

export default CourseExam;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, padding: 20, paddingBottom: 180 },

  header: { marginBottom: 14 },
  title: { textAlign: "right" },
  subtitle: { textAlign: "right", marginBottom: 0 },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", textAlign: "right" },
  cardBody: { marginTop: 8, fontSize: 13, lineHeight: 20, textAlign: "right" },

  question: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "right",
    lineHeight: 22,
  },

  options: { marginTop: 12, gap: 10 },
  option: { borderWidth: 1, borderRadius: 14, padding: 12 },
  optionRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  optionKey: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionKeyText: { fontWeight: "900" },
  optionText: { flex: 1, textAlign: "right", lineHeight: 20 },

  hint: { marginTop: 12, textAlign: "right", fontSize: 12 },
  feedback: { marginTop: 12 },
  feedbackText: { textAlign: "right", fontSize: 13, fontWeight: "800" },

  actionsRow: {
    marginTop: 14,
    flexDirection: "row-reverse",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#ffffff", fontWeight: "900" },
  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  secondaryButtonText: { fontWeight: "900" },

  statRow: { flexDirection: "row-reverse", gap: 10, marginTop: 12 },
  statPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statText: { fontWeight: "900" },
  meta: { marginTop: 10, textAlign: "right", fontSize: 12 },
});

