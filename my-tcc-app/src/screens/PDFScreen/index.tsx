import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as S from "./styles";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useDocumentsContext } from "../../context/documentsContext";
import { Document } from "../../models/document";
import { usePDFScreen } from "../../hooks/usePDFScreen";

const PDFScreen = () => {
  const { documents, loading, hourTotal, hourByCategory, hourMin } = useDocumentsContext();
  const { gerarPDFComNome } = usePDFScreen();

  return (
    <S.Container>
      <S.ContainerScroll>
        <S.Table>
          <S.Row>
            <S.HeaderCell>Total de horas</S.HeaderCell>
          </S.Row>
          <S.Cell>
            {hourTotal}/{hourMin}
          </S.Cell>
          <S.Row>
            <S.HeaderCell>Horas por categoria</S.HeaderCell>
          </S.Row>
          {hourByCategory!.map((item, index) => (
            <S.Cell key={index}>
              {item.categoria}: {item.horas} / {item.maxHoras}
            </S.Cell>
          ))}
          <S.Row>
            <S.HeaderCell>Categoria</S.HeaderCell>
            <S.HeaderCell>Atividade</S.HeaderCell>
            <S.HeaderCell>Tipo</S.HeaderCell>
            <S.HeaderCell>Horas</S.HeaderCell>
            <S.HeaderCell>Observação</S.HeaderCell>
            <S.HeaderCell>Link</S.HeaderCell>
          </S.Row>
          {[...documents!]
            .sort((a, b) => a.categoria.localeCompare(b.categoria))
            .map(doc => (
              <S.Row key={doc.id}>
                <S.Cell>{doc.categoria}</S.Cell>
                <S.Cell>{doc.atividade}</S.Cell>
                <S.Cell>{doc.tipo ?? "-"}</S.Cell>
                <S.Cell>{doc.horas}</S.Cell>
                <S.Cell>{doc.observacao}</S.Cell>
                <S.Cell>{doc.link}</S.Cell>
              </S.Row>
            ))}
        </S.Table>
      </S.ContainerScroll>
      <S.Button onPress={gerarPDFComNome}>
        <S.ButtonText>Exportar</S.ButtonText>
      </S.Button>
    </S.Container>
  );
};

export default PDFScreen;
