import React from "react";
import * as S from "./styles";

type ProgressBarTotalProps = {
  currentValue: number;
  maxValue: number;
};

const ProgressBarTotal: React.FC<ProgressBarTotalProps> = ({ currentValue, maxValue }) => {
  const percentage = Math.min((currentValue / maxValue) * 100, 100);

  return (
    <S.Container testID="container">
      <S.TotalTitle testID="total-title">Total de Horas</S.TotalTitle>
      <S.BarBackground testID="bar-background">
        <S.BarFill
          percentage={percentage}
          testID="bar-fill"
        />
      </S.BarBackground>
      <S.TotalValue>
        {currentValue}/{maxValue}
      </S.TotalValue>
    </S.Container>
  );
};

export default ProgressBarTotal;
