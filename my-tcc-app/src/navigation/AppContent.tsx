import React, { useEffect } from "react";
import { DocumentsProvider, useDocumentsContext } from "./../context/documentsContext";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { defaultTheme } from "./../theme/DefautTheme";
import DrawerRoute from "./drawer.routes";
import { ThemeProvider } from "styled-components/native";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "./../service/Database";
import CircularLoading from "../components/CircularLoading";

function AppContent() {
  const { getDocumentsList, getBarema, documents } = useDocumentsContext();

  useEffect(() => {
    getDocumentsList();
    getBarema();
    console.log(documents);
  }, []);

  return documents?.length == 0 ? (
    <CircularLoading></CircularLoading>
  ) : (
    <NavigationContainer>
      <DrawerRoute></DrawerRoute>
      <StatusBar
        backgroundColor={defaultTheme.colors.primary}
        style="light"
      />
    </NavigationContainer>
  );
}

export default AppContent;
