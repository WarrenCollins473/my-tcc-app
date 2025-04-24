import React, { useEffect, useState } from "react";
import * as S from "./styles";
import { DocumentDetailScreenProps } from "../../navigation/types/navigation";
import { Picker } from "@react-native-picker/picker";
import * as baremaJson from "./../../../assets/barema.json";
import { converterJsonParaBarema } from "../../utils/BaremaConversor";
import { Barema } from "../../models/barema";
import { View } from "react-native";

export default function DocumentDetails({ navigation, route }: DocumentDetailScreenProps) {
  const { itemId } = route.params;

  const [categoria, setCategoria] = useState("");
  const [atividade, setAtividade] = useState("");
  const [tipo, setTipo] = useState("");
  const [horasLancadas, setHorasLancadas] = useState("");
  const [observacao, setObservacao] = useState("");
  const [link, setLink] = useState("");

  const [barema, setBarema] = useState<Barema>();
  const [horasObtidas, setHorasObtidas] = useState("0");
  const [cargaHorariaIndividual, setCargaHorariaIndividual] = useState(0);
  const [cargaHorariaMaxima, setCargaHorariaMaxima] = useState(0);

  useEffect(() => {
    const barema = converterJsonParaBarema(baremaJson);
    setBarema(barema);
  }, []);

  function temTipo(barema: Barema) {
    return (
      barema?.categorias.find(cat => cat.nome === categoria)?.atividades.find(act => act.nome === atividade)?.tipos !==
      undefined
    );
  }

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

  function handleHorasLancadasChange(value: string) {
    setHorasLancadas(value);
    const parsedValue = parseInt(value.replace(/[^0-9]/g, ""));
    const horas = calcularHora(parsedValue, cargaHorariaIndividual, cargaHorariaMaxima);
    setHorasObtidas(horas.toString());
  }

  function handeAtividadeChange(value: string) {
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

  return (
    <S.ContainerScroll>
      <S.Container>
        <S.Label>Categoria</S.Label>
        <S.PickerContainer>
          <Picker
            numberOfLines={4}
            selectedValue={categoria}
            onValueChange={itemValue => setCategoria(itemValue)}
          >
            <Picker.Item
              label={"Nenhum"}
              value={"Nenhum"}
            />
            {barema?.categorias.map(categoria => (
              <Picker.Item
                key={categoria.nome}
                label={categoria.nome}
                value={categoria.nome}
              />
            ))}
          </Picker>
        </S.PickerContainer>
        <S.Label>Atividade</S.Label>
        <S.PickerContainer>
          <Picker
            numberOfLines={4}
            selectedValue={atividade}
            onValueChange={itemValue => handeAtividadeChange(itemValue)}
          >
            <Picker.Item
              label={"Nenhum"}
              value={"Nenhum"}
            />
            {barema?.categorias
              .find(cat => cat.nome === categoria)
              ?.atividades.map(atividade => (
                <Picker.Item
                  style={{ fontSize: 14 }}
                  key={atividade.nome}
                  label={atividade.nome}
                  value={atividade.nome}
                />
              ))}
          </Picker>
        </S.PickerContainer>

        <S.Label>Tipo</S.Label>
        <S.PickerContainer>
          <Picker
            numberOfLines={4}
            selectedValue={tipo}
            onValueChange={itemValue => handleTipoChange(itemValue)}
            enabled={
              barema?.categorias.find(cat => cat.nome === categoria)?.atividades.find(act => act.nome === atividade)
                ?.tipos == undefined
                ? false
                : true
            }
          >
            <Picker.Item
              label={"Nenhum"}
              value={"Nenhum"}
            />
            {barema?.categorias
              .find(cat => cat.nome === categoria)
              ?.atividades.find(act => act.nome === atividade)
              ?.tipos?.map(tipo => (
                <Picker.Item
                  key={tipo.nome}
                  label={tipo.nome}
                  value={tipo.nome}
                />
              ))}
          </Picker>
        </S.PickerContainer>
        <S.Table>
          <S.TableRow header>
            <S.TableHeader>Carga Horária</S.TableHeader>
          </S.TableRow>
          <S.TableRow>
            <S.TableCell>Individual</S.TableCell>
            <S.TableCell>Máxima</S.TableCell>
          </S.TableRow>
          <S.TableRow>
            <S.TableCell>
              {temTipo(barema!)
                ? barema?.categorias
                    .find(cat => cat.nome === categoria)
                    ?.atividades.find(act => act.nome === atividade)
                    ?.tipos?.find(tip => tip.nome === tipo)?.carga_individual
                : barema?.categorias.find(cat => cat.nome === categoria)?.atividades.find(act => act.nome === atividade)
                    ?.carga_individual}
            </S.TableCell>
            <S.TableCell>
              {temTipo(barema!)
                ? barema?.categorias
                    .find(cat => cat.nome === categoria)
                    ?.atividades.find(act => act.nome === atividade)
                    ?.tipos?.find(tip => tip.nome === tipo)?.carga_maxima
                : barema?.categorias.find(cat => cat.nome === categoria)?.atividades.find(act => act.nome === atividade)
                    ?.carga_maxima}
            </S.TableCell>
          </S.TableRow>
        </S.Table>
        <S.CargaContainer>
          <S.CargaBox>
            <S.CargaLabel>Horas lançadas</S.CargaLabel>
            <S.CargaInput
              keyboardType="numeric"
              value={horasLancadas}
              onChangeText={value => handleHorasLancadasChange(value)}
            />
          </S.CargaBox>
          <S.CargaBox>
            <S.CargaLabel>Horas obtidas</S.CargaLabel>
            <S.HorasObtidas>{horasObtidas}</S.HorasObtidas>
          </S.CargaBox>
        </S.CargaContainer>

        <S.Label>Observação</S.Label>
        <S.Input
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Digite uma observação"
        />

        <S.Label>Links</S.Label>
        <S.Input
          value={link}
          onChangeText={setLink}
          placeholder="URL do certificado"
        />

        <S.Button erro={false}>
          <S.ButtonText>Salvar</S.ButtonText>
        </S.Button>

        {itemId && (
          <S.Button erro={true}>
            <S.ButtonText>Excluir</S.ButtonText>
          </S.Button>
        )}
      </S.Container>
    </S.ContainerScroll>
  );
}
