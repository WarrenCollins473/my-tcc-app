import { useEffect, useState } from "react";
import { useDocumentsContext } from "../context/documentsContext";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { Document, horasPorCategoria } from "../models/document";
import { Alert } from "react-native";
export const usePDFScreen = () => {
  const { documents, loading, hourByCategory, hourTotal, hourMin, getDocumentsList } = useDocumentsContext();

  useEffect(() => {
    getDocumentsList();
  }, []);

  const gerarPDFComNome = async () => {
    try {
      const { uri: pdfTempUri } = await Print.printToFileAsync({
        html: gerarHtmlTabela(documents!, hourTotal!, hourByCategory!),
        base64: true,
      });

      const novoNome = "relatorio_horas_complementares.pdf";
      const novoCaminho = FileSystem.documentDirectory + novoNome;

      await FileSystem.moveAsync({
        from: pdfTempUri,
        to: novoCaminho,
      });

      await Sharing.shareAsync(novoCaminho);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
      console.error(error);
    }
  };
  function gerarHtmlTabela(documentos: Document[], horasTotal: number, horasPorCategoria: horasPorCategoria[]) {
    const linhas = [...documentos]
      .sort((a, b) => a.categoria.localeCompare(b.categoria))
      .map(
        doc => `
        <tr>
          <td>${doc.categoria}</td>
          <td>${doc.atividade}</td>
          <td>${doc.tipo ?? "-"}</td>
          <td>${doc.horas}</td>
          <td>${doc.observacao ?? "-"}</td>
          <td><a href="${doc.link}">${doc.link}</a></td>
        </tr>`,
      )
      .join("");

    const horasPorCategoriaHtml = [...horasPorCategoria]
      .map(
        item => `
        <tr>
          <td>${item.categoria}: ${item.horas} / ${item.maxHoras}</td>
        </tr>`,
      )
      .join("");

    return `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              font-family: Arial;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
            a {
              color: #0077cc;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <h1>Relatório de Documentos</h1>
          <table>
            <thead>
              <tr>
                <th>Total de horas</th>
              </tr>
              <tr>
                <td>${horasTotal}/${hourMin}</td>
              </tr>
            ${horasPorCategoriaHtml}
              <tr>
                <th>Categoria</th>
                <th>Atividade</th>
                <th>Tipo</th>
                <th>Horas</th>
                <th>Observação</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              ${linhas}
            </tbody>
          </table>
        </body>
      </html>
    `;
  }
  return { gerarHtmlTabela, gerarPDFComNome, loading, documents };
};
