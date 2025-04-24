import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.View`
  background-color: ${defaultTheme.colors.background};
  padding-horizontal: 16px;
  justify-content: center;
`;

export const ContainerScroll = styled.ScrollView`
  background-color: ${defaultTheme.colors.background};
`;

export const adicionarButton = styled.TouchableOpacity`
  background-color: ${defaultTheme.colors.primary};
  width: 60px;
  height: 60px;
  border-radius: 50px;
  position: absolute;
  bottom: 16px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;
