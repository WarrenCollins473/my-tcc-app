import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.View`
  margin-vertical: 10px;
  align-items: center;
`;

export const BarBackground = styled.View`
  width: 50%;
  background-color: ${defaultTheme.colors.background};
  border-radius: 14px;
  overflow: hidden;
  height: 38px;
  border: 1px solid black;
  elevation: 5;
`;

export const BarFill = styled.View<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  background-color: ${defaultTheme.colors.secondary};
  height: 100%;
`;

export const TotalTitle = styled.Text`
  margin: 8px;
  font-size: ${defaultTheme.fontsize.medium}px;
  font-weight: 500;
  text-align: center;
  color: ${defaultTheme.colors.text};
`;

export const TotalValue = styled.Text`
  margin: 8px;
  font-size: ${defaultTheme.fontsize.medium}px;
  font-weight: 500;
  text-align: center;
  color: ${defaultTheme.colors.text};
`;
