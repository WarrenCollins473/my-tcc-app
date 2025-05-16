import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${defaultTheme.colors.background};
`;

export const Text = styled.Text`
  font-size: ${defaultTheme.fontsize.medium}px;
  color: ${defaultTheme.colors.secondary};
  font-weight: bold;
`;
