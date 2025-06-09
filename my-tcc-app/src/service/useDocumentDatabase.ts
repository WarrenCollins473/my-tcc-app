import { useSQLiteContext } from "expo-sqlite";
import { Document } from "../models/document";
import { Alert } from "react-native";

export function useDocumentDatabase() {
  const db = useSQLiteContext();

  async function insert(data: Omit<Document, "id">) {
    try {
      await db.runAsync(
        "INSERT INTO documento (categoria, atividade, tipo, observacao, link, horas) VALUES (?, ?, ?, ?, ?, ?)",
        [data.categoria, data.atividade, data.tipo ? data.tipo : null, data.observacao, data.link, data.horas],
      );
      Alert.alert("Sucesso", "Documento salvo com sucesso!");
    } catch (error) {
      console.error("Error creating document:", error);
      Alert.alert("Erro", "Erro ao salvar o documento.");
    }
  }

  async function readAll() {
    try {
      const result = await db.getAllAsync("SELECT * FROM documento");
      return result as Document[];
    } catch (error) {
      console.error("Error reading documents:", error);
      return [] as Document[]; // Return an empty array in case of error
    }
  }

  async function deleteDocumentById(id: number) {
    try {
      await db.runAsync("DELETE FROM documento WHERE id = ?", [id]);
      Alert.alert("Sucesso", "Documento excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting document:", error);
      Alert.alert("Erro", "Erro ao excluir o documento.");
    }
  }
  async function updateDocumentById(id: number, data: Partial<Document>) {
    try {
      const columns = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(", ");
      const values = Object.values(data);
      await db.runAsync(`UPDATE documento SET ${columns} WHERE id = ?`, [...values, id]);
      Alert.alert("Sucesso", "Documento atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating document:", error);
      Alert.alert("Erro", "Erro ao atualizar o documento.");
    }
  }
  async function getDocumentById(id: number) {
    try {
      const result = await db.getAllAsync("SELECT * FROM documento WHERE id = ?", [id]);
      if (result && result.length > 0) {
        return result as Document[];
      } else {
        Alert.alert("Erro", "Documento não encontrado.");
        return null;
      }
    } catch (error) {
      console.error("Error getting document by ID:", error);
      Alert.alert("Erro", "Erro ao buscar o documento.");
      return null;
    }
  }

  return { insert, readAll, getDocumentById, deleteDocumentById, updateDocumentById };
}
