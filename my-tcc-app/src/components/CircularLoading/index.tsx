import React from "react";
import { ActivityIndicator } from "react-native";
import * as S from "./styles";

import { defaultTheme } from "../../theme/DefautTheme";

const CircularLoading: React.FC = () => {
  return (
    <S.Container testID="loading-indicator">
      <ActivityIndicator
        testID="activity-indicator"
        color={defaultTheme.colors.primary}
        size={80}
      ></ActivityIndicator>
    </S.Container>
  );
};

export default CircularLoading;
