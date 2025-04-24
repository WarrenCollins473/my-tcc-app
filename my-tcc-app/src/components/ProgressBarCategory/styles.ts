import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.View`
  margin: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const BarBackground = styled.View`
  width: 90px;
  background-color: ${defaultTheme.colors.background};
  border-radius: 14px;
  overflow: hidden;
  height: 18px;
  border: 1px solid black;
  elevation: 5;
`;
export const BarFill = styled.View<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  background-color: ${defaultTheme.colors.secondary};
  height: 100%;
`;
export const CategoryTitle = styled.Text`
  font-size: ${defaultTheme.fontsize.small}px;
  font-weight: 500;
  text-align: left;
  color: ${defaultTheme.colors.text};
  width: 160px;
`;
export const CategoryValue = styled.Text`
  font-size: ${defaultTheme.fontsize.medium}px;
  font-weight: 500;
  text-align: center;
  color: ${defaultTheme.colors.text};
`;
