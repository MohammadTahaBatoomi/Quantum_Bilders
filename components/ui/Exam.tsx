import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNav from "./BottomNav";
import { useTheme } from "./theme";
import examData from "../../json/exam.json";

type ExamOptionKey = string;

type ExamQuestion = {
  id: number;
  question: string;
  options: Record<ExamOptionKey, string>;
};

type ExamData = {
  test_title: string;
  fields_mapping: Record<ExamOptionKey, string>;
  questions: ExamQuestion[];
};

const Exam = () => {
  const { colors, text } = useTheme();
  const data = examData as ExamData;
  const questions = React.useMemo(() => data.questions ?? [], [data.questions]);

  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, ExamOptionKey>>(
    {}
  );

  const isFinished = questions.length > 0 && index >= questions.length;
  const current = !isFinished ? questions[index] ?? null : null;
  const selected = current ? answers[String(current.id)] : undefined;

  const onSelect = (key: ExamOptionKey) => {
    if (!current) return;
    const qid = String(current.id);
    if (answers[qid]) return; // فقط یک‌بار
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  };

  const onNext = () => {
    if (isFinished) return;
    if (!current) return;
    if (!selected) return;
    const next = index + 1;
    if (next >= questions.length) setIndex(questions.length);
    else setIndex(next);
  };

  const onBack = () => {
    if (index <= 0) return;
    setIndex((prev) => prev - 1);
  };

  const onRestart = () => {
    setAnswers({});
    setIndex(0);
  };

  const result = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const key of Object.keys(data.fields_mapping ?? {})) {
      counts[key] = 0;
    }

    for (const q of questions) {
      const selectedKey = answers[String(q.id)];
      if (!selectedKey) continue;
      counts[selectedKey] = (counts[selectedKey] ?? 0) + 1;
    }

    const totalAnswered = Object.keys(answers).length;
    const entries = Object.entries(counts).map(([key, count]) => {
      const pct = totalAnswered ? Math.round((count / totalAnswered) * 100) : 0;
      return { key, count, pct, label: data.fields_mapping[key] ?? key };
    });

    entries.sort((a, b) => b.count - a.count);
    const topCount = entries[0]?.count ?? 0;
    const top = entries.filter((e) => e.count === topCount && topCount > 0);
    return { entries, totalAnswered, top };
  }, [answers, data.fields_mapping, questions]);

  const renderOption = (key: ExamOptionKey, label: string) => {
    if (!current) return null;
    const isSelected = selected === key;
    const hasAnswered = !!selected;

    return (
      <Pressable
        key={key}
        disabled={hasAnswered}
        onPress={() => onSelect(key)}
        style={({ pressed }) => [
          styles.option,
          {
            backgroundColor: isSelected ? colors.primarySoft : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
            opacity: hasAnswered && !isSelected ? 0.65 : 1,
          },
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
          <Text style={[text.title, styles.title]}>{data.test_title}</Text>
          <Text style={[text.subtitle, styles.subtitle]}>
            {isFinished
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
              فایل `json/exam.json` خالی است یا فرمتش درست نیست.
            </Text>
          </View>
        ) : isFinished ? (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.title }]}>
              نتیجه نهایی
            </Text>

            {result.top.length ? (
              <View style={styles.topBox}>
                <Text style={[styles.topTitle, { color: colors.title }]}>
                  پیشنهاد مسیر:
                </Text>
                <Text style={[styles.topValue, { color: colors.primary }]}>
                  {result.top.map((t) => t.label).join(" / ")}
                </Text>
              </View>
            ) : (
              <Text style={[styles.cardBody, { color: colors.subtitle }]}>
                هنوز به هیچ سوالی جواب ندادی.
              </Text>
            )}

            <Text style={[styles.meta, { color: colors.muted }]}>
              تعداد پاسخ‌ها: {result.totalAnswered} از {questions.length}
            </Text>

            <View style={styles.breakdown}>
              {result.entries.map((item) => (
                <View
                  key={item.key}
                  style={[
                    styles.breakItem,
                    { borderColor: colors.border, backgroundColor: colors.input },
                  ]}
                >
                  <Text style={[styles.breakLabel, { color: colors.title }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.breakPct, { color: colors.subtitle }]}>
                    {item.pct}% ({item.count})
                  </Text>
                </View>
              ))}
            </View>

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
              {Object.entries(current.options).map(([key, label]) =>
                renderOption(key, label)
              )}
            </View>

            {selected ? (
              <Text style={[styles.feedback, { color: colors.success }]}>
                انتخابت ثبت شد.
              </Text>
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
                disabled={!selected}
                onPress={onNext}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: colors.primary, opacity: !selected ? 0.5 : 1 },
                  pressed && selected && { opacity: 0.92 },
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

export default Exam;

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
  cardTitle: { fontSize: 16, fontWeight: "900", textAlign: "right" },
  cardBody: { marginTop: 8, fontSize: 13, lineHeight: 20, textAlign: "right" },

  question: {
    fontSize: 14,
    fontWeight: "900",
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
  feedback: { marginTop: 12, textAlign: "right", fontSize: 13, fontWeight: "900" },

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

  topBox: { marginTop: 10 },
  topTitle: { textAlign: "right", fontSize: 13, fontWeight: "900" },
  topValue: { marginTop: 6, textAlign: "right", fontSize: 18, fontWeight: "900" },
  meta: { marginTop: 10, textAlign: "right", fontSize: 12 },
  breakdown: { marginTop: 12, gap: 10 },
  breakItem: { borderWidth: 1, borderRadius: 14, padding: 12, flexDirection: "row-reverse", justifyContent: "space-between" },
  breakLabel: { fontWeight: "900" },
  breakPct: { fontWeight: "700" },
});
