import "./gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { defaultTheme } from "./src/theme/DefautTheme";
import DrawerRoute from "./src/navigation/drawer.routes";
import { ThemeProvider } from "styled-components/native";
import { DocumentsProvider } from "./src/context/documentsContext";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "./src/service/Database";

export default function App() {
  return (
    <SQLiteProvider
      onInit={initializeDatabase}
      databaseName={"DocumentDatabase"}
    >
      <DocumentsProvider>
        <ThemeProvider theme={defaultTheme}>
          <NavigationContainer>
            <DrawerRoute></DrawerRoute>
            <StatusBar
              backgroundColor={defaultTheme.colors.primary}
              style="light"
            />
          </NavigationContainer>
        </ThemeProvider>
      </DocumentsProvider>
    </SQLiteProvider>
  );
}
