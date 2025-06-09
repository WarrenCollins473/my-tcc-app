import { FlatList } from "react-native";
import React, { useEffect } from "react";
import ProgressBar from "../../components/ProgressBarTotal";
import ProgressBarCategory from "../../components/ProgressBarCategory";
import * as S from "./styles";
import { useDocumentsContext } from "../../context/documentsContext";
import CircularLoading from "../../components/CircularLoading";
import { horasPorCategoria } from "../../models/document";

export default function HourScreen() {
  const { hourByCategory, hourTotal, loading, barema, getDocumentsList } = useDocumentsContext();

  useEffect(() => {
    getDocumentsList();
  }, []);

  const renderItem = ({ item }: { item: horasPorCategoria }) => {
    return (
      <ProgressBarCategory
        currentValue={item.horas}
        maxValue={item.maxHoras}
        categoryName={item.categoria}
      ></ProgressBarCategory>
    );
  };

  return loading ? (
    <CircularLoading></CircularLoading>
  ) : (
    <S.Container>
      <ProgressBar
        currentValue={hourTotal!}
        maxValue={barema!.total_minimo}
      ></ProgressBar>
      <S.Line></S.Line>
      <S.Title>Por categoria</S.Title>
      <FlatList
        data={hourByCategory}
        renderItem={renderItem}
      ></FlatList>
    </S.Container>
  );
}
