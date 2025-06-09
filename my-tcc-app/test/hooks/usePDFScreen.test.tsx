import { renderHook, act, WaitFor } from "@testing-library/react-hooks";
import { usePDFScreen } from "../../src/hooks/usePDFScreen"; // Ajuste o caminho se necessário
import { useDocumentsContext } from "../../src/context/documentsContext";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { Document, horasPorCategoria } from "../../src/models/document"; // Ajuste o caminho se necessário

// --- Mocks ---

// Mock react-native Alert
const mockAlert = jest.fn();
jest.mock("react-native", () => ({
  Alert: {
    alert: mockAlert,
  },
  Platform: { OS: "ios" }, // Mock Platform se necessário
}));

// Mock expo-file-system
const mockMoveAsync = jest.fn();
jest.mock("expo-file-system", () => ({
  documentDirectory: "file:///mock/document/dir/",
  moveAsync: mockMoveAsync,
}));

// Mock expo-print
const mockPrintToFileAsync = jest.fn();
jest.mock("expo-print", () => ({
  printToFileAsync: mockPrintToFileAsync,
}));

// Mock expo-sharing
const mockShareAsync = jest.fn();
jest.mock("expo-sharing", () => ({
  shareAsync: mockShareAsync,
}));

// Mock documents context
const mockGetDocumentsList = jest.fn();
const mockDocuments: Document[] = [
  {
    id: 1,
    categoria: "Categoria B",
    atividade: "Atividade B1",
    tipo: "Tipo X",
    horas: 10,
    observacao: "Obs B1",
    link: "linkB1",
  },
  {
    id: 2,
    categoria: "Categoria A",
    atividade: "Atividade A1",
    tipo: undefined,
    horas: 20,
    observacao: "",
    link: "linkA1",
  },
  {
    id: 3,
    categoria: "Categoria B",
    atividade: "Atividade B2",
    tipo: "Tipo Y",
    horas: 5,
    observacao: "Obs B2",
    link: "linkB2",
  },
];
const mockHourByCategory: horasPorCategoria[] = [
  { categoria: "Categoria A", horas: 20, maxHoras: 50 },
  { categoria: "Categoria B", horas: 15, maxHoras: 40 },
];
const mockHourTotal = 35;
const mockHourMin = 100;

jest.mock("../../src/context/documentsContext", () => ({
  useDocumentsContext: () => ({
    documents: mockDocuments,
    loading: false,
    hourByCategory: mockHourByCategory,
    hourTotal: mockHourTotal,
    hourMin: mockHourMin,
    getDocumentsList: mockGetDocumentsList,
  }),
}));

// --- Test Suite ---

describe("usePDFScreen Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations to default successful state
    mockPrintToFileAsync.mockResolvedValue({ uri: "file:///mock/temp/pdf_uri.pdf" });
    mockMoveAsync.mockResolvedValue(undefined);
    mockShareAsync.mockResolvedValue(undefined);
    mockAlert.mockImplementation(() => {}); // Default no-op
  });

  it("deve chamar getDocumentsList no efeito inicial", () => {
    renderHook(() => usePDFScreen());
    expect(mockGetDocumentsList).toHaveBeenCalledTimes(1);
  });

  describe("gerarHtmlTabela", () => {
    it("deve gerar o HTML correto com base nos documentos e horas fornecidos", () => {
      const { result } = renderHook(() => usePDFScreen());
      const html = result.current.gerarHtmlTabela(mockDocuments, mockHourTotal, mockHourByCategory);

      // Verifica partes chave do HTML
      expect(html).toContain("<h1>Relatório de Documentos</h1>");
      expect(html).toContain(`<td>${mockHourTotal}/${mockHourMin}</td>`);
      // Verifica horas por categoria (ordenado por nome)
      expect(html).toContain("<td>Categoria A: 20 / 50</td>");
      expect(html).toContain("<td>Categoria B: 15 / 40</td>");
      // Verifica cabeçalhos da tabela principal
      expect(html).toContain("<th>Categoria</th>");
      expect(html).toContain("<th>Atividade</th>");
      // Verifica linhas de documentos (ordenado por categoria)
      expect(html).toContain("<td>Categoria A</td>");
      expect(html).toContain("<td>Atividade A1</td>");
      expect(html).toContain("<td>-</td>"); // Tipo undefined
      expect(html).toContain("<td>20</td>");
      expect(html).toContain("<td>-</td>"); // Observacao undefined
      expect(html).toContain('<td><a href="linkA1">linkA1</a></td>');

      expect(html).toContain("<td>Categoria B</td>");
      expect(html).toContain("<td>Atividade B1</td>");
      expect(html).toContain("<td>Tipo X</td>");
      expect(html).toContain("<td>10</td>");
      expect(html).toContain("<td>Obs B1</td>");
      expect(html).toContain('<td><a href="linkB1">linkB1</a></td>');

      expect(html).toContain("<td>Atividade B2</td>");
      expect(html).toContain("<td>Tipo Y</td>");
      expect(html).toContain("<td>5</td>");
      expect(html).toContain("<td>Obs B2</td>");
      expect(html).toContain('<td><a href="linkB2">linkB2</a></td>');

      // Verifica estrutura básica
      expect(html).toMatch(/^\s*<html>.*<\/html>\s*$/s); // Checa se começa com <html> e termina com </html>
      expect(html).toContain("<style>");
      expect(html).toContain("<body>");
      expect(html).toContain("<table>");
    });

    it("deve lidar com listas vazias de documentos e horas por categoria", () => {
      const { result } = renderHook(() => usePDFScreen());
      const html = result.current.gerarHtmlTabela([], 0, []);

      expect(html).toContain("<td>0/100</td>"); // hourMin ainda vem do mock do contexto
      expect(html).not.toContain("<td>Categoria A:");
      expect(html).not.toContain("<td>Categoria B:");
      expect(html).toContain("<tbody>\n              \n            </tbody>"); // tbody vazio
    });
  });

  // describe("gerarPDFComNome", () => {
  //   it("deve chamar Print, FileSystem e Sharing na ordem correta em caso de sucesso", async () => {
  //     const { result } = renderHook(() => usePDFScreen());
  //     const expectedHtml = result.current.gerarHtmlTabela(mockDocuments, mockHourTotal, mockHourByCategory);
  //     const tempPdfUri = "file:///mock/temp/pdf_uri.pdf";
  //     const finalPdfPath = "file:///mock/document/dir/relatorio_horas_complementares.pdf";

  //     await act(async () => {
  //       await result.current.gerarPDFComNome();
  //     });

  //     // 1. Chamou Print.printToFileAsync com o HTML correto
  //     expect(mockPrintToFileAsync).toHaveBeenCalledTimes(1);
  //     expect(mockPrintToFileAsync).toHaveBeenCalledWith({
  //       html: expectedHtml,
  //       base64: true,
  //     });

  //     // 2. Chamou FileSystem.moveAsync com os caminhos corretos
  //     expect(mockMoveAsync).toHaveBeenCalledTimes(1);
  //     expect(mockMoveAsync).toHaveBeenCalledWith({
  //       from: tempPdfUri,
  //       to: finalPdfPath,
  //     });

  //     // 3. Chamou Sharing.shareAsync com o caminho final
  //     expect(mockShareAsync).toHaveBeenCalledTimes(1);
  //     expect(mockShareAsync).toHaveBeenCalledWith(finalPdfPath);

  //     // 4. Não deve chamar Alert
  //     expect(mockAlert).not.toHaveBeenCalled();
  //   });

  //   it("deve chamar Alert e logar erro se Print.printToFileAsync falhar", async () => {
  //     const printError = new Error("Print failed");
  //     mockPrintToFileAsync.mockRejectedValue(printError);
  //     const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {}); // Suprime o log no output do teste

  //     const { result } = renderHook(() => usePDFScreen());

  //     await act(async () => {
  //       await result.current.gerarPDFComNome();
  //     });

  //     expect(mockPrintToFileAsync).toHaveBeenCalledTimes(1);
  //     expect(mockMoveAsync).not.toHaveBeenCalled();
  //     expect(mockShareAsync).not.toHaveBeenCalled();
  //     expect(mockAlert).toHaveBeenCalledTimes(1);
  //     expect(mockAlert).toHaveBeenCalledWith("Erro", "Não foi possível gerar o PDF.");
  //     expect(consoleErrorSpy).toHaveBeenCalledWith(printError);

  //     consoleErrorSpy.mockRestore();
  //   });

  //   it("deve chamar Alert e logar erro se FileSystem.moveAsync falhar", async () => {
  //     const moveError = new Error("Move failed");
  //     mockMoveAsync.mockRejectedValue(moveError);
  //     const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  //     const { result } = renderHook(() => usePDFScreen());

  //     await act(async () => {
  //       await result.current.gerarPDFComNome();
  //     });

  //     expect(mockPrintToFileAsync).toHaveBeenCalledTimes(1);
  //     expect(mockMoveAsync).toHaveBeenCalledTimes(1);
  //     expect(mockShareAsync).not.toHaveBeenCalled();
  //     expect(mockAlert).toHaveBeenCalledTimes(1);
  //     expect(mockAlert).toHaveBeenCalledWith("Erro", "Não foi possível gerar o PDF.");
  //     expect(consoleErrorSpy).toHaveBeenCalledWith(moveError);

  //     consoleErrorSpy.mockRestore();
  //   });

  //   it("deve chamar Alert e logar erro se Sharing.shareAsync falhar", async () => {
  //     // Nota: O hook atual não tem um try/catch em volta do shareAsync,
  //     // então um erro aqui quebraria o teste. O ideal seria adicionar.
  //     // Assumindo que o hook *deveria* tratar esse erro:
  //     const shareError = new Error("Share failed");
  //     mockShareAsync.mockRejectedValue(shareError);
  //     const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  //     const { result } = renderHook(() => usePDFScreen());

  //     await act(async () => {
  //       // Envolvemos a chamada em um try/catch no teste para simular o tratamento ideal
  //       try {
  //         await result.current.gerarPDFComNome();
  //       } catch (e) {
  //         // Esperado que o erro seja relançado se não tratado no hook
  //         expect(e).toBe(shareError);
  //       }
  //     });

  //     // Verificamos as chamadas que deveriam ter ocorrido antes do erro
  //     expect(mockPrintToFileAsync).toHaveBeenCalledTimes(1);
  //     expect(mockMoveAsync).toHaveBeenCalledTimes(1);
  //     expect(mockShareAsync).toHaveBeenCalledTimes(1);

  //     // Se o hook tratasse o erro do Sharing com Alert:
  //     // expect(mockAlert).toHaveBeenCalledTimes(1);
  //     // expect(mockAlert).toHaveBeenCalledWith('Erro', 'Não foi possível compartilhar o PDF.'); // Mensagem hipotética
  //     // expect(consoleErrorSpy).toHaveBeenCalledWith(shareError);

  //     // Como não trata, verificamos que o Alert não foi chamado por *este* erro
  //     expect(mockAlert).not.toHaveBeenCalled();
  //     // O erro seria logado se não fosse pego pelo try/catch do teste
  //     // expect(consoleErrorSpy).toHaveBeenCalledWith(shareError);

  //     consoleErrorSpy.mockRestore();
  //   });
  // });
});
