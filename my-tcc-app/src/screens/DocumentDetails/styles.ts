import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.View`
    flex: 1;   
    background-color: ${defaultTheme.colors.background};
    padding: 24px;
    border-radius: 4px;
`;