import { Stack } from "expo-router";
import { ScreenStackHeaderConfig } from "react-native-screens";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen  options={{ headerShown: false }} name="index" />
    </Stack>
  );
}
