import React, { useEffect } from "react";
import * as S from "./styles";
import DocumentCard from "../../components/DocumentCard/intex";
import { Document } from "../../models/document";
import { FlatList } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../../navigation/types/navigation";
import { useDocumentsContext } from "../../context/documentsContext";
import EmptyDocument from "../../components/emptyDocument";

export default function DocumentScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const { documents, getDocumentsList } = useDocumentsContext();

  useEffect(() => {
    getDocumentsList();
  }, []);

  function renderItem({ item }: { item: Document }) {
    return (
      <DocumentCard
        atividade={item.atividade}
        categoria={item.categoria}
        horas={item.horas}
        id={item.id}
        tipo={item.tipo!}
      ></DocumentCard>
    );
  }
  return (
    <S.Container>
      {documents?.length == 0 ? (
        <EmptyDocument></EmptyDocument>
      ) : (
        <FlatList
          data={documents}
          renderItem={renderItem}
        ></FlatList>
      )}

      <S.adicionarButton onPress={() => navigation.navigate("Documento", {})}>
        <AntDesign
          name="plus"
          size={30}
          color="white"
        />
      </S.adicionarButton>
    </S.Container>
  );
}
