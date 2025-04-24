import { createDrawerNavigator } from "@react-navigation/drawer";
import HourScreen from "../screens/HourScreen";
import { defaultTheme } from "../theme/DefautTheme";
import StackRoute from "./stack.routes";

export default function DrawerRoute() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: defaultTheme.colors.primary,
        },
        headerTintColor: defaultTheme.colors.background,
        headerTitleStyle: {
          fontWeight: "bold",
          color: defaultTheme.colors.background,
          textAlign: "center",
        },
        drawerStyle: {
          backgroundColor: defaultTheme.colors.primary,
        },
        headerShadowVisible: false,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HourScreen}
      ></Drawer.Screen>
      <Drawer.Screen
        name="Documentos"
        component={StackRoute}
      ></Drawer.Screen>
    </Drawer.Navigator>
  );
}
