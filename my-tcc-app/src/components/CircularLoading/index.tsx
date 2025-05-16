import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";
import * as S from "./styles";

import { defaultTheme } from "../../theme/DefautTheme";

const CircularLoading: React.FC = () => {
  return (
    <S.Container>
      <ActivityIndicator
        color={defaultTheme.colors.primary}
        size={80}
      ></ActivityIndicator>
    </S.Container>
  );
};

export default CircularLoading;
