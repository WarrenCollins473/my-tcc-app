import { FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBarTotal";
import ProgressBarCategory from "../../components/ProgressBarCategory";
import { Barema, Categoria } from "../../models/barema";
import { converterJsonParaBarema } from "../../utils/BaremaConversor";
import * as baremaJson from "./../../../assets/barema.json";
import * as S from "./styles";

export default function HourScreen() {
  const [barema, setBarema] = useState<Barema>();

  useEffect(() => {
    const barema = converterJsonParaBarema(baremaJson);
    setBarema(barema);
  }, []);

  const renderItem = ({ item }: { item: Categoria }) => {
    return (
      <ProgressBarCategory
        currentValue={20}
        maxValue={item.limite_categoria}
        categoryName={item.nome}
      ></ProgressBarCategory>
    );
  };
  return (
    <S.Container>
      <ProgressBar
        currentValue={50}
        maxValue={200}
      ></ProgressBar>
      <S.Line></S.Line>
      <S.Title>Por categoria</S.Title>
      <FlatList
        data={barema?.categorias}
        renderItem={renderItem}
      ></FlatList>
    </S.Container>
  );
}
