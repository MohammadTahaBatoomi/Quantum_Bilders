import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import pythonRoadmapFa from "../../json/python_roadmap_fa.json";
import BottomNav from "./BottomNav";
import { useTheme } from "./theme";
import { useRouter } from "expo-router";

type RoadmapSection = {
  title: string;
  items?: string[];
  note?: string;
  children?: RoadmapSection[];
};

type RoadmapData = {
  meta: { title: string; by: string; tagline: string; topic: string };
  intro: string;
  sections: RoadmapSection[];
};

const Roadmap = () => {
  const { colors, text } = useTheme();
  const data = pythonRoadmapFa as RoadmapData;
  const router = useRouter();

  const START_ROUTE = "/video";

  const renderBullets = (items: string[]) => (
    <View style={styles.bulletList}>
      {items.map((item, idx) => (
        <View key={`${item}-${idx}`} style={styles.bulletRow}>
          <Text style={[styles.bullet, { color: colors.muted }]}>•</Text>
          <Text style={[styles.bulletText, { color: colors.subtitle }]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[text.title, styles.title]}>
            {data.meta.title} — {data.meta.topic}
          </Text>
          <Text style={[text.subtitle, styles.subtitle]}>{data.meta.tagline}</Text>
        </View>


        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            {data.meta.title} — {data.meta.by}
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            {data.intro}
          </Text>
        </View>

        {data.sections.map((section, index) => (
          <View
            key={`${section.title}-${index}`}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.stepTitle, { color: colors.title }]}>
              {section.title}
            </Text>

            {section.note ? (
              <Text style={[styles.note, { color: colors.muted }]}>
                {section.note}
              </Text>
            ) : null}

            {section.items?.length ? renderBullets(section.items) : null}

            {section.children?.length ? (
              <View style={styles.subSections}>
                {section.children.map((child, childIndex) => (
                  <View key={`${child.title}-${childIndex}`} style={styles.sub}>
                    <Text style={[styles.subTitle, { color: colors.title }]}>
                      {child.title}
                    </Text>
                    {child.note ? (
                      <Text style={[styles.note, { color: colors.muted }]}>
                        {child.note}
                      </Text>
                    ) : null}
                    {child.items?.length ? renderBullets(child.items) : null}
                    
                  </View>
                  
                ))}
              </View>
            ) : null}
          </View>
          
        ))}
                <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.stepTitle, { color: colors.title }]}>
            آماده آموزش هستی؟
          </Text>
          <Text style={[styles.stepDesc, { color: colors.subtitle }]}>
            اگه آماده‌ای، روی دکمه شروع بزن تا وارد مرحله بعدی بشیم.
          </Text>
          <Pressable
            onPress={() => router.push(START_ROUTE)}
            style={({ pressed }) => [
              styles.ctaButton,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.ctaText}>شروع آموزش</Text>
          </Pressable>
        </View>
      </ScrollView>
        
      <BottomNav />
    </View>
  );
};

export default Roadmap;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 180,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    textAlign: "right",
  },

  subtitle: {
    textAlign: "right",
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "right",
  },

  stepDesc: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right",
  },

  note: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "right",
  },

  bulletList: {
    marginTop: 10,
    gap: 6,
  },

  bulletRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
  },

  bullet: {
    width: 18,
    textAlign: "center",
    lineHeight: 20,
  },

  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "right",
  },

  subSections: {
    marginTop: 12,
    gap: 12,
  },

  sub: {
    borderTopWidth: 1,
    paddingTop: 12,
    borderTopColor: "rgba(0,0,0,0.06)",
  },

  subTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "right",
  },

  ctaButton: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  ctaText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
});
