import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Documento: { itemId?: number };
};

export type DocumentDetailScreenProps = {
  navigation: DrawerNavigationProp<RootStackParamList, "Documento">;
  route: RouteProp<RootStackParamList, "Documento">;
};
