import React from "react";
import * as S from "./styles";
import DocumentCard from "../../components/DocumentCard/intex";


export default function DocumentScreen() {
  return (
    <S.Container>
      <DocumentCard atividade="Atuação como ministrante de palestra" categoria="ENSINO" horas={20} id={20} tipo="Relacionada" ></DocumentCard>
    </S.Container>
  );
}