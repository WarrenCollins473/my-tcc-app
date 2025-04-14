import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';
import HourScreen from '../screens/HourScreen';
import { defaultTheme } from '../theme/DefautTheme';


export default function DrawerRoute() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator 
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: defaultTheme.colors.primary,
        },
        headerTintColor: defaultTheme.colors.background,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: defaultTheme.colors.background,
            textAlign: 'center',
          },  
        drawerStyle: {
            backgroundColor: defaultTheme.colors.primary, 
            },
      }}>
        <Drawer.Screen
        name='Minhas horas'
        component={HourScreen}
        >
        </Drawer.Screen>
    </Drawer.Navigator>
  );
}