import React from "react";
import * as S from "./styles";
import { DocumentDetailScreenProps } from "../../navigation/types/navigation";
import { Picker } from "@react-native-picker/picker";
import CircularLoading from "../../components/CircularLoading";
import { useDocumentDetails } from "../../hooks/useDocumentDetails";

export default function DocumentDetails({ navigation, route }: DocumentDetailScreenProps) {
  const { itemId } = route.params;
  const {
    atividade,
    barema,
    categoria,
    horasLancadas,
    horasObtidas,
    link,
    loading,
    observacao,
    tipo,
    categoriaErro,
    atividadeErro,
    horasLancadasErro,
    tipoErro,
    linkErro,
    cargaHorariaIndividual,
    cargaHorariaMaxima,
    handleAtividadeChange,
    handleHorasLancadasChange,
    handleTipoChange,
    handleDelete,
    handleSubmit,
    handleUpdate,
    setCategoria,
    setLink,
    setObservacao,
    temTipo,
  } = useDocumentDetails(itemId);

  return loading ? (
    <CircularLoading></CircularLoading>
  ) : (
    <S.ContainerScroll>
      <S.Container>
        <S.Label>Categoria</S.Label>
        <S.PickerContainer style={{ borderColor: categoriaErro ? "red" : "#ccc" }}>
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
        <S.PickerContainer style={{ borderColor: atividadeErro ? "red" : "#ccc" }}>
          <Picker
            numberOfLines={4}
            selectedValue={atividade}
            onValueChange={itemValue => handleAtividadeChange(itemValue, barema!, categoria)}
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
        <S.PickerContainer style={{ borderColor: tipoErro ? "red" : "#ccc" }}>
          <Picker
            numberOfLines={4}
            selectedValue={tipo}
            onValueChange={itemValue => handleTipoChange(itemValue, atividade, categoria, barema!)}
            enabled={temTipo(barema!)}
          >
            <Picker.Item
              style={{ color: temTipo(barema!) ? "black" : "#bfbfbf" }}
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
            <S.TableCell>{cargaHorariaIndividual}</S.TableCell>
            <S.TableCell>{cargaHorariaMaxima}</S.TableCell>
          </S.TableRow>
        </S.Table>
        <S.CargaContainer>
          <S.CargaBox>
            <S.CargaLabel>Horas lançadas</S.CargaLabel>
            <S.CargaInput
              testID="horas-lancadas"
              keyboardType="numeric"
              value={horasLancadas}
              onChangeText={value => handleHorasLancadasChange(value)}
              style={{ borderColor: horasLancadasErro ? "red" : "#ccc" }}
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
          style={{ borderColor: linkErro ? "red" : "#ccc" }}
        />

        <S.Button
          erro={false}
          onPress={itemId ? handleUpdate : handleSubmit}
        >
          <S.ButtonText>Salvar</S.ButtonText>
        </S.Button>

        {itemId && (
          <S.Button
            erro={true}
            onPress={() => handleDelete(itemId)}
          >
            <S.ButtonText>Excluir</S.ButtonText>
          </S.Button>
        )}
      </S.Container>
    </S.ContainerScroll>
  );
}
