import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import courseData from "../../json/python_course_aparat.json";
import BottomNav from "./BottomNav";
import { useTheme } from "./theme";
import { router } from "expo-router";

const Video = () => {
  const { colors, text } = useTheme();

  type CourseData = {
    about: {
      course_title: string;
      instructor: string;
      total_duration: string;
      level: string;
      parts_count: number;
      platform: string;
    };
    videos: {
      id: number;
      title: string;
      iframe: string;
    }[];
  };

  const data = courseData as CourseData;

  const extractIframeSrc = (iframe: string) => {
    const match = iframe.match(/src="([^"]+)"/i);
    return match?.[1] ?? null;
  };

  const toAparatWatchUrl = (srcUrl: string) => {
    const hashMatch = srcUrl.match(/videohash\/([^/]+)\//i);
    const hash = hashMatch?.[1];
    if (!hash) return srcUrl;
    return `https://www.aparat.com/v/${hash}`;
  };

  const openVideo = async (iframe: string) => {
    const src = extractIframeSrc(iframe);
    if (!src) return;
    const url = toAparatWatchUrl(src);
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[text.title, styles.title]}>{data.about.course_title}</Text>
          <Text style={[text.subtitle, styles.subtitle]}>
            مدرس: {data.about.instructor}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.title }]}>
            اطلاعات دوره
          </Text>

          <View style={styles.chips}>
            <View style={[styles.chip, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.chipText, { color: colors.primary }]}>
                {data.about.platform}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.chipText, { color: colors.primary }]}>
                سطح: {data.about.level}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.chipText, { color: colors.primary }]}>
                تعداد قسمت‌ها: {data.about.parts_count}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.primarySoft }]}>
              <Text style={[styles.chipText, { color: colors.primary }]}>
                مدت کل: {data.about.total_duration}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.title }]}>
            لیست قسمت‌ها
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            برای تماشا، روی هر قسمت بزن.
          </Text>
        </View>

        {data.videos.map((video, index) => (
          <Pressable
            key={video.id}
            onPress={() => openVideo(video.iframe)}
            style={({ pressed }) => [
              styles.videoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.92 },
            ]}
          >
            <View style={styles.videoTop}>
              <Text style={[styles.videoIndex, { color: colors.muted }]}>
                {index + 1}
              </Text>
              <View style={styles.videoTextCol}>
                <Text
                  numberOfLines={1}
                  style={[styles.videoTitle, { color: colors.title }]}
                >
                  {video.title}
                </Text>
                <Text style={[styles.videoMeta, { color: colors.subtitle }]}>
                  مشاهده در {data.about.platform}
                </Text>
              </View>

              <View style={[styles.playPill, { backgroundColor: colors.primary }]}>
                <Text style={styles.playPillText}>تماشا</Text>
              </View>
            </View>
            
          </Pressable>
          
        ))}
                  <View
                    style={[
                      styles.actionCard,
                      { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.actionTitle, { color: colors.title }]}>
                      شروع تست روزانه
                    </Text>
                    <Text style={[styles.actionSubtitle, { color: colors.subtitle }]}>
                      چند تست کوتاه برای گرم شدن؟
                    </Text>
        
                    <Pressable
                      android_ripple={{ color: "rgba(255,255,255,0.2)" }}
                       onPress={() => router.push("/exam/python")}
                      style={({ pressed }) => [
                        styles.primaryButton,
                        {
                          backgroundColor: colors.primary,
                          opacity: pressed ? 0.9 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.primaryButtonText}>شروع</Text>
                    </Pressable>
                  </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
};

export default Video

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    marginTop : 20,
    textAlign: "right",
  },
  subtitle: {
    textAlign: "right",
    marginBottom: 0,
    marginLeft: 0,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  card: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  cardLabel: {
    fontSize: 12,
    textAlign: "right",
  },
  cardValue: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right",
  },
  actionCard: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
  },
  actionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "right",
  },
  primaryButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  quickRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
  },
  quickSubtitle: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "right",
  },
  sectionHeader: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "right",
  },
  manageGrid: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  manageCard: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    minHeight: 92,
    justifyContent: "space-between",
  },
  manageTitle: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  manageSubtitle: {
    marginTop: 6,
    fontSize: 11,
    textAlign: "right",
  },
  overviewCard: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  overviewSummary: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 8,
  },
  overviewRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  overviewLabel: {
    fontSize: 12,
    textAlign: "right",
  },
  overviewValue: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  overviewDivider: {
    height: 1,
    opacity: 0.7,
  },
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
    marginBottom: 14,
  },

  title: {
    textAlign: "right",
  },

  subtitle: {
    textAlign: "right",
    marginBottom: 0,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "right",
  },

  chips: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  chipText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },

  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
  },

  sectionSubtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "right",
  },

  videoCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  videoTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },

  videoIndex: {
    width: 28,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "800",
  },

  videoTextCol: {
    flex: 1,
  },

  videoTitle: {
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },

  videoMeta: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "right",
  },

  playPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  playPillText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },
});
