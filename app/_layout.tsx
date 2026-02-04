import { View } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider, sharedStyles } from "../components/ui/theme";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <View style={sharedStyles.screen}>
        <ThemeToggle />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </ThemeProvider>
  );
}
