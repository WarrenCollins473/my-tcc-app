import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 10px;
`;
export const Button = styled.TouchableOpacity`
  background-color: ${defaultTheme.colors.primary};
  padding: 12px 0;
  border-radius: 24px;
  align-items: center;
  margin-top: 16px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: 700;
`;

export const ContainerScroll = styled.ScrollView``;

export const Table = styled.View`
  border-width: 1px;
  border-color: #ccc;
`;

export const Row = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-color: #ccc;
`;

export const HeaderCell = styled.Text`
  flex: 1;
  font-weight: bold;
  padding: 5px;
  background-color: #e0e0e0;
`;

export const Cell = styled.Text`
  flex: 1;
  padding: 5px;
`;
