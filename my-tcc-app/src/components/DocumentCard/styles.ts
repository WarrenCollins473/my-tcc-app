import styled from "styled-components/native";
import { defaultTheme } from "../../theme/DefautTheme";

export const Container = styled.TouchableOpacity`
    background-color: ${defaultTheme.colors.background};
    padding: 16px;
    border-radius: 4px;
    margin: 8px 0;
    border: 1px solid black;
    margin: 15px;
`;

export const Title = styled.Text`
    font-size: ${defaultTheme.fontsize.small}px;
    font-weight: bold;
    color: ${defaultTheme.colors.text};
    margin-bottom: 8px;
`;

export const Description = styled.Text`
    font-size: ${defaultTheme.fontsize.small}px;
    color: ${defaultTheme.colors.text};
    margin-bottom: 8px;
`;

export const Details = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const GroupDetails = styled.View`
`;


