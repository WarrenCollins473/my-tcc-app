import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";
import { ScrollView } from "react-native";

export const ContainerScroll = styled(ScrollView)`
  background-color: ${defaultTheme.colors.background};
`;

export const Container = styled.View`
  background-color: #fff;
  padding: 16px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-top: 12px;
`;

export const Input = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0 10px;
  height: 40px;
  margin-top: 4px;
`;

export const PickerContainer = styled.View`
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 4px;
`;

export const GreyPickerContainer = styled(PickerContainer)`
  background-color: #bfbfbf;
`;

export const CargaContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 16px 0;
`;

export const CargaBox = styled.View``;

export const CargaLabel = styled.Text`
  font-weight: 600;
  margin-bottom: 4px;
`;

export const CargaInput = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0 10px;
  height: 40px;
`;
export const HorasObtidas = styled.Text`
  text-align: center;
  font-weight: 600;
  margin: 8px;
`;

export const Button = styled.TouchableOpacity<{ erro: boolean }>`
  background-color: ${props => (props.erro ? defaultTheme.colors.error : defaultTheme.colors.secondary)};
  padding: 12px 0;
  border-radius: 24px;
  align-items: center;
  margin-top: 16px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: 700;
`;

export const Table = styled.View`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 6px;
  margin-bottom: 16px;
  margin-top: 16px;
  background-color: white;
`;

export const TableRow = styled.View<{ header?: boolean }>`
  flex-direction: row;
  border-bottom-width: ${props => (props.header ? "0px" : "1px")};
  border-bottom-color: #eee;
`;

export const TableHeader = styled.Text`
  flex: 1;
  padding: 12px;
  font-weight: bold;
  text-align: center;
  background-color: #f0f0f0;
`;

export const TableCell = styled.Text`
  flex: 1;
  padding: 12px;
  text-align: center;
  color: #555;
`;
