import { SafeAreaView } from "react-native";
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
        <SafeAreaView style={sharedStyles.screen}>
          {showFloatingToggle ? <ThemeToggle /> : null}
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SafeAreaView>
      </ThemeProvider>
    </UserProvider>
  );
}
