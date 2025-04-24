import React from "react";
import * as S from "./styles";
import DocumentCard from "../../components/DocumentCard/intex";
import { Document } from "../../models/document";
import { FlatList } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../../navigation/types/navigation";

const documnets: Document[] = [
  {
    id: 1,
    categoria: "ENSINO",
    atividade: "Atuação como ministrante de palestra",
    tipo: "Relacionada",
    horas_obtidas: 20,
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    categoria: "ENSINO",
    atividade: "Atuação como ministrante de palestra",
    horas_obtidas: 20,
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 3,
    categoria: "ENSINO",
    atividade: "Atuação como ministrante de palestra",
    horas_obtidas: 20,
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 4,
    categoria: "ENSINO",
    atividade: "Atuação como ministrante de palestra",
    horas_obtidas: 20,
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 5,
    categoria: "ENSINO",
    atividade: "Atuação como ministrante de palestra",
    horas_obtidas: 20,
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 6,
    categoria: "ENSINO",
    atividade: "Atuação como ministrante de palestra",
    horas_obtidas: 20,
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 7,
    categoria: "ENSINO",
    atividade: "Atuação como ministrante de palestra",
    horas_obtidas: 20,
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 8,
    categoria: "ENSINO",
    atividade:
      "Participação em Conselho Superior, em Conselho de Campus e/ou em demais órgãos colegiados do IFBA com previsão de representação discente (a cada semestre)",
    horas_obtidas: 20,
    tipo: "Artigo curto, resumo, resumo estendido ou similar (indexado)",
    observacao: "Palestra sobre TCC",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

function renderItem({ item }: { item: Document }) {
  return (
    <DocumentCard
      atividade={item.atividade}
      categoria={item.categoria}
      horas={item.horas_obtidas}
      id={item.id}
      tipo={item.tipo!}
    ></DocumentCard>
  );
}

export default function DocumentScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  return (
    <S.Container>
      <FlatList
        data={documnets}
        renderItem={renderItem}
      ></FlatList>
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
