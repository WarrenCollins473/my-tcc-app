import React from "react";
import * as S from "./styles";

type ProgressBarCategoryProps = {
    currentValue: number;
    maxValue: number;
    categoryName?: string;
    };

const ProgressBarCategory: React.FC<ProgressBarCategoryProps> = ({
    currentValue,
    maxValue,
    categoryName,
}) => { 
    const percentage = Math.min((currentValue / maxValue) * 100, 100);

    return (
        <S.Container>
            <S.CategoryTitle>{categoryName}</S.CategoryTitle>
            <S.CategoryValue>{currentValue}/{maxValue}</S.CategoryValue>
            <S.BarBackground >
                <S.BarFill
                    percentage={percentage}
                />
            </S.BarBackground>
        </S.Container>
    );
}
export default ProgressBarCategory;
