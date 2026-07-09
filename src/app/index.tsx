import { SafeAreaProvider } from "react-native-safe-area-context";
import LogInScreen from "./(auth)/loginScreen";

export default function Index() {
  return (
    <SafeAreaProvider>
      <LogInScreen/>
    </SafeAreaProvider>
  );
}


