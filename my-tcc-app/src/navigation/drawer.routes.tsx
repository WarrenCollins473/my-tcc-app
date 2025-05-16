import { createDrawerNavigator } from "@react-navigation/drawer";
import HourScreen from "../screens/HourScreen";
import { defaultTheme } from "../theme/DefautTheme";
import StackRoute from "./stack.routes";
import AntDesign from "@expo/vector-icons/AntDesign";
import PDFScreen from "../screens/PDFScreen";
import { useEffect } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function DrawerRoute() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: defaultTheme.colors.background,
        drawerInactiveTintColor: defaultTheme.colors.background,
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
        name="Minhas Horas"
        component={HourScreen}
        options={{
          headerTitle: "Minhas Horas",
          drawerIcon: ({ color }) => (
            <AntDesign
              name="clockcircleo"
              size={20}
              color={defaultTheme.colors.background}
            />
          ),
        }}
      ></Drawer.Screen>
      <Drawer.Screen
        name="Documentos"
        component={StackRoute}
        options={{
          headerTitle: "Documentos",
          drawerIcon: ({ color }) => (
            <AntDesign
              name="file1"
              size={20}
              color={defaultTheme.colors.background}
            />
          ),
        }}
      ></Drawer.Screen>
      <Drawer.Screen
        name="Gerar PDF"
        component={PDFScreen}
        options={{
          headerTitle: "Gerar PDF",
          drawerIcon: ({ color }) => (
            <AntDesign
              name="download"
              size={20}
              color={defaultTheme.colors.background}
            />
          ),
        }}
      ></Drawer.Screen>
    </Drawer.Navigator>
  );
}
