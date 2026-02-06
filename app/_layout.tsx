import { SafeAreaView, View } from "react-native";
import { Stack, usePathname } from "expo-router";
import { ThemeProvider, sharedStyles } from "../components/ui/theme";
import ThemeToggle from "../components/ui/ThemeToggle";
import { UserProvider } from "../components/state/UserContext";

export default function RootLayout() {
  const pathname = usePathname();
  const showFloatingToggle = pathname !== "/dashboard";

  return (
    <UserProvider>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1 }}> {/* حتما flex:1 */}
          <View style={{ flex: 1, position: "relative" }}> {/* relative برای BottomNav */}
            {showFloatingToggle && <ThemeToggle />}

            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
        </SafeAreaView>
      </ThemeProvider>
    </UserProvider>
  );
}
