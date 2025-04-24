import DocumentScreen from "../screens/DocumentScreen";
import { RootStackParamList } from "./types/navigation";
import DocumentDetails from "../screens/DocumentDetails";
import { createStackNavigator } from "@react-navigation/stack";

export default function StackRoute() {
  const Stack = createStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={DocumentScreen}
      />
      <Stack.Screen
        name="Documento"
        component={DocumentDetails}
      />
    </Stack.Navigator>
  );
}
