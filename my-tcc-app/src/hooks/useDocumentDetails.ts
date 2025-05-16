import { useEffect, useState } from "react";
import { useDocumentsContext } from "../context/documentsContext";
import { Barema } from "../models/barema";
import { useDocumentDatabase } from "../service/useDocumentDatabase";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../navigation/types/navigation";
import { Alert } from "react-native";

export const useDocumentDetails = (itemId: number | undefined) => {
  const { barema, deleteDocument, createDocument, updateDocument } = useDocumentsContext();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const { getDocumentById } = useDocumentDatabase();
  const [categoria, setCategoria] = useState("");
  const [atividade, setAtividade] = useState("");
  const [tipo, setTipo] = useState("");
  const [horasLancadas, setHorasLancadas] = useState("");
  const [observacao, setObservacao] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [horasObtidas, setHorasObtidas] = useState("0");
  const [cargaHorariaIndividual, setCargaHorariaIndividual] = useState(0);
  const [cargaHorariaMaxima, setCargaHorariaMaxima] = useState(0);
  const [categoriaErro, setCategoriaErro] = useState(false);
  const [atividadeErro, setAtividadeErro] = useState(false);
  const [horasLancadasErro, setHorasLancadasErro] = useState(false);
  const [tipoErro, setTipoErro] = useState(false);
  const [linkErro, setLinkErro] = useState(false);

  useEffect(() => {
    if (itemId) {
      loadDocument();
    }
    handleHorasLancadasChange("");
    setLoading(false);
  }, []);

  const loadDocument = async () => {
    const documentsList = await getDocumentById(itemId!);
    const document = documentsList!.find(doc => doc.id === itemId);
    setCategoria(document!.categoria);
    handleAtividadeChange(document!.atividade);
    handleTipoChange(document!.tipo!);
    setObservacao(document!.observacao);
    setLink(document!.link);
    handleHorasLancadasChange(document!.horas.toString());
    setHorasObtidas(document!.horas.toString());
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir este documento?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          deleteDocument(id);
          navigation.goBack();
        },
      },
    ]);
  };
  const handleSubmit = async () => {
    setCategoriaErro(false);
    setAtividadeErro(false);
    setHorasLancadasErro(false);
    setLinkErro(false);
    setTipoErro(false);

    let erro = false;

    if (!categoria) {
      setCategoriaErro(true);
      erro = true;
    }
    if (!atividade) {
      setAtividadeErro(true);
      erro = true;
    }
    if (temTipo(barema!)) {
      if (tipo === "Nenhum") {
        setTipoErro(true);
        erro = true;
      }
    }
    if (!horasObtidas || isNaN(Number(horasObtidas)) || Number(horasObtidas) <= 0) {
      setHorasLancadasErro(true);
      erro = true;
    }
    if (!link) {
      setLinkErro(true);
      erro = true;
    }

    if (erro) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente.");
      return;
    }
    createDocument({
      categoria,
      atividade,
      tipo,
      observacao,
      link,
      horas: parseInt(horasObtidas),
    });
    navigation.goBack();
  };

  const handleUpdate = async () => {
    setCategoriaErro(false);
    setAtividadeErro(false);
    setHorasLancadasErro(false);
    setLinkErro(false);
    setTipoErro(false);

    let erro = false;

    if (!categoria) {
      setCategoriaErro(true);
      erro = true;
    }
    if (!atividade) {
      setAtividadeErro(true);
      erro = true;
    }
    if (temTipo(barema!)) {
      if (tipo === "Nenhum") {
        setTipoErro(true);
        erro = true;
      }
    }
    if (!horasObtidas || isNaN(Number(horasObtidas)) || Number(horasObtidas) <= 0) {
      setHorasLancadasErro(true);
      erro = true;
    }
    if (!link) {
      setLinkErro(true);
      erro = true;
    }

    if (erro) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente.");
      return;
    }
    updateDocument({
      id: itemId!,
      categoria,
      atividade,
      tipo,
      observacao,
      link,
      horas: parseInt(horasObtidas),
    });
    navigation.goBack();
  };

  function calcularHora(pontosLancados: number, individual: number, maxima: number) {
    if (pontosLancados > 0) {
      if (pontosLancados < individual) {
        return 0;
      } else if (maxima === 0) {
        return 0;
      } else {
        return Math.min(maxima, Math.floor(pontosLancados / individual) * individual);
      }
    } else {
      return "0";
    }
  }

  function temTipo(barema: Barema) {
    return (
      barema?.categorias.find(cat => cat.nome === categoria)?.atividades.find(act => act.nome === atividade)?.tipos !==
      undefined
    );
  }

  function handleHorasLancadasChange(value: string) {
    setHorasLancadas(value);
    const parsedValue = parseInt(value.replace(/[^0-9]/g, ""));
    const horas = calcularHora(parsedValue, cargaHorariaIndividual, cargaHorariaMaxima);
    setHorasObtidas(horas.toString());
  }

  function handleAtividadeChange(value: string) {
    setAtividade(value);
    if (
      barema?.categorias.find(cat => cat.nome === categoria)?.atividades.find(act => act.nome === value)
        ?.carga_individual
    ) {
      const atividadeSelecionada = barema?.categorias
        .find(cat => cat.nome === categoria)
        ?.atividades.find(act => act.nome === value);
      setCargaHorariaIndividual(atividadeSelecionada?.carga_individual || 0);
      setCargaHorariaMaxima(atividadeSelecionada?.carga_maxima || 0);
    }
  }

  function handleTipoChange(value: string) {
    setTipo(value);
    const tipoSelecionado = barema?.categorias
      .find(cat => cat.nome === categoria)
      ?.atividades.find(act => act.nome === atividade)
      ?.tipos?.find(tip => tip.nome === value);
    if (tipoSelecionado) {
      setCargaHorariaIndividual(tipoSelecionado.carga_individual);
      setCargaHorariaMaxima(tipoSelecionado.carga_maxima);
    } else {
      const atividadeSelecionada = barema?.categorias
        .find(cat => cat.nome === categoria)
        ?.atividades.find(act => act.nome === atividade);
      if (atividadeSelecionada) {
        setCargaHorariaIndividual(atividadeSelecionada.carga_individual || 0);
        setCargaHorariaMaxima(atividadeSelecionada.carga_maxima || 0);
      }
    }
  }
  return {
    categoria,
    atividade,
    tipo,
    horasLancadas,
    observacao,
    link,
    loading,
    horasObtidas,
    cargaHorariaIndividual,
    cargaHorariaMaxima,
    categoriaErro,
    atividadeErro,
    horasLancadasErro,
    tipoErro,
    linkErro,
    barema,
    setCategoria,
    setAtividade,
    setTipo,
    setHorasLancadas,
    setObservacao,
    setLink,
    setLoading,
    setHorasObtidas,
    setCargaHorariaIndividual,
    setCargaHorariaMaxima,
    temTipo,
    calcularHora,
    handleHorasLancadasChange,
    handleAtividadeChange,
    handleTipoChange,
    handleDelete,
    handleSubmit,
    handleUpdate,
    loadDocument,
  };
};
