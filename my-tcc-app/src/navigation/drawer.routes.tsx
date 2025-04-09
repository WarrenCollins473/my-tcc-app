import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';
import HourScreen from '../screens/HourScreen';


export default function DrawerRoute() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
        <Drawer.Screen
        name='HourScreen'
        component={HourScreen}
        >
        </Drawer.Screen>
    </Drawer.Navigator>
  );
}