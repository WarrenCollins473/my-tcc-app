import './gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { defaultTheme} from './src/theme/DefautTheme';
import DrawerRoute from './src/navigation/drawer.routes';
import { ThemeProvider } from 'styled-components/native';


export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
    <NavigationContainer >
      <DrawerRoute ></DrawerRoute>
      <StatusBar backgroundColor={defaultTheme.colors.primary} style='light'/>
    </NavigationContainer>
    </ThemeProvider>
  );
}

