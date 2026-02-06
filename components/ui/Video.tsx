import React from "react";
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import courseData from "../../json/python_course_aparat.json";
import BottomNav from "./BottomNav";
import { useTheme } from "./theme";
import { useRouter } from "expo-router";

const Video = () => {
  const { colors, text } = useTheme();
  const router = useRouter();

  const WebView =
    (() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require("react-native-webview").WebView as any;
      } catch {
        return null;
      }
    })() ?? null;

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
  const [selectedId, setSelectedId] = React.useState<number>(
    data.videos[0]?.id ?? 1
  );

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

  const selected = React.useMemo(
    () => data.videos.find((v) => v.id === selectedId) ?? data.videos[0] ?? null,
    [data.videos, selectedId]
  );
  const selectedSrc = selected ? extractIframeSrc(selected.iframe) : null;
  const selectedWatchUrl = selectedSrc ? toAparatWatchUrl(selectedSrc) : null;
  const courseTitle = data.about.course_title;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={data.videos}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={[text.title, styles.title]}>
                {data.about.course_title}
              </Text>
              <Text style={[text.subtitle, styles.subtitle]}>
                مدرس: {data.about.instructor}
              </Text>
            </View>

            <View
              style={[
                styles.playerCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.title }]}>
                {selected?.title ?? "پخش"}
              </Text>

              <View style={styles.playerFrame}>
                {WebView && selectedSrc ? (
                  <WebView
                    source={{ uri: selectedSrc }}
                    originWhitelist={["*"]}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsFullscreenVideo
                    style={styles.webview}
                  />
                ) : (
                  <View style={styles.playerFallback}>
                    <Text style={[styles.fallbackText, { color: colors.subtitle }]}>
                      برای نمایش ویدیو داخل اپ، پکیج{" "}
                      <Text style={{ color: colors.title, fontWeight: "800" }}>
                        react-native-webview
                      </Text>{" "}
                      را نصب کن.
                    </Text>
                    {selectedWatchUrl ? (
                      <Pressable
                        onPress={() => Linking.openURL(selectedWatchUrl)}
                        style={({ pressed }) => [
                          styles.fallbackButton,
                          { backgroundColor: colors.primary },
                          pressed && { opacity: 0.9 },
                        ]}
                      >
                        <Text style={styles.fallbackButtonText}>
                          باز کردن در آپارات
                        </Text>
                      </Pressable>
                    ) : null}
                  </View>
                )}
              </View>

              <View style={styles.chips}>
                <View
                  style={[styles.chip, { backgroundColor: colors.primarySoft }]}
                >
                  <Text style={[styles.chipText, { color: colors.primary }]}>
                    {data.about.platform}
                  </Text>
                </View>
                <View
                  style={[styles.chip, { backgroundColor: colors.primarySoft }]}
                >
                  <Text style={[styles.chipText, { color: colors.primary }]}>
                    سطح: {data.about.level}
                  </Text>
                </View>
                <View
                  style={[styles.chip, { backgroundColor: colors.primarySoft }]}
                >
                  <Text style={[styles.chipText, { color: colors.primary }]}>
                    تعداد قسمت‌ها: {data.about.parts_count}
                  </Text>
                </View>
                <View
                  style={[styles.chip, { backgroundColor: colors.primarySoft }]}
                >
                  <Text style={[styles.chipText, { color: colors.primary }]}>
                    مدت کل: {data.about.total_duration}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/exam/[course]" as any,
                    params: { course: courseTitle },
                  })
                }
                style={({ pressed }) => [
                  styles.examButton,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Text style={styles.examButtonText}>رفتن به آزمون دوره</Text>
              </Pressable>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.title }]}>
                لیست قسمت‌ها
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
                روی هر قسمت بزن تا داخل اپ پخش شود.
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const isActive = item.id === selectedId;
          return (
            <Pressable
              onPress={() => setSelectedId(item.id)}
              style={({ pressed }) => [
                styles.videoCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                isActive && { borderColor: colors.primary },
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
                    {item.title}
                  </Text>
                  <Text style={[styles.videoMeta, { color: colors.subtitle }]}>
                    مشاهده در {data.about.platform}
                  </Text>
                </View>

                <View
                  style={[
                    styles.playPill,
                    { backgroundColor: isActive ? colors.primary : colors.toggleBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.playPillText,
                      { color: isActive ? "#ffffff" : colors.muted },
                    ]}
                  >
                    {isActive ? "در حال پخش" : "پخش"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />

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

  examButton: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  examButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },

  playerCard: {
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

  playerFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },

  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },

  playerFallback: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  fallbackText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "right",
  },

  fallbackButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  fallbackButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
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
    fontSize: 12,
    fontWeight: "900",
  },
});
