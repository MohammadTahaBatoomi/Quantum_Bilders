import { SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider, sharedStyles } from "../components/ui/theme";
import ThemeToggle from "../components/ui/ThemeToggle";
import { UserProvider } from "../components/state/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <SafeAreaView style={sharedStyles.screen}>
          <ThemeToggle />
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
