import React from "react";
import * as S from "./styles";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../../navigation/types/navigation";

type DocumentCardProps = {
  atividade: string;
  categoria: string;
  horas: number;
  tipo?: string;
  id: number;
};

export default function DocumentCard({ atividade, categoria, horas, tipo, id }: DocumentCardProps) {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  return (
    <S.Container onPress={() => navigation.navigate("Documento", { itemId: id })}>
      <S.GroupDetails>
        <S.Title>Categoria</S.Title>
        <S.Description>{categoria}</S.Description>
      </S.GroupDetails>
      <S.GroupDetails>
        <S.Title>Atividade</S.Title>
        <S.Description>{atividade}</S.Description>
      </S.GroupDetails>
      {tipo && (
        <S.GroupDetails>
          <S.Title>Tipo</S.Title>
          <S.DetailText>{tipo}</S.DetailText>
        </S.GroupDetails>
      )}
      <S.GroupDetails>
        <S.Title>Horas</S.Title>
        <S.DetailText>{horas}</S.DetailText>
      </S.GroupDetails>
    </S.Container>
  );
}
