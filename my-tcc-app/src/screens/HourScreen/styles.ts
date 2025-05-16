import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.View`
  flex: 1;
  background-color: ${defaultTheme.colors.background};
  padding: 20px;
`;

export const Line = styled.Text`
  background-color: black;
  height: 1px;
  width: 90%;
  align-self: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: ${defaultTheme.fontsize.medium}px;
  font-weight: bold;
  color: ${defaultTheme.colors.text};
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
`;
