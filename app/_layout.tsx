import { Stack } from "expo-router";
import { ThemeProvider } from "../components/ui/theme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
