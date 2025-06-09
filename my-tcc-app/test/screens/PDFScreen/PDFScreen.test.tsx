import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PDFScreen from "../../../src/screens/PDFScreen";
import { useDocumentsContext } from "../../../src/context/documentsContext";
import { usePDFScreen } from "../../../src/hooks/usePDFScreen";
import { Document, horasPorCategoria } from "../../../src/models/document";

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
const mockUseDocumentsContext = {
  documents: mockDocuments,
  loading: false,
  hourTotal: 35,
  hourByCategory: mockHourByCategory,
  hourMin: 100,
  getDocumentsList: jest.fn(),
};
jest.mock("../../../src/context/documentsContext", () => ({
  useDocumentsContext: jest.fn(() => mockUseDocumentsContext),
}));

const mockGerarPDFComNome = jest.fn();
const mockUsePDFScreen = {
  gerarPDFComNome: mockGerarPDFComNome,
};
jest.mock("../../../src/hooks/usePDFScreen", () => ({
  usePDFScreen: jest.fn(() => mockUsePDFScreen),
}));

describe("PDFScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useDocumentsContext as jest.Mock).mockImplementation(() => mockUseDocumentsContext);
    (usePDFScreen as jest.Mock).mockImplementation(() => mockUsePDFScreen);
  });

  it("deve renderizar a tabela com os dados do contexto corretamente", () => {
    const { getByText, getAllByTestId, getAllByText } = render(<PDFScreen />);

    // Verifica totais
    expect(getByText("Total de horas")).toBeTruthy();
    expect(getByText("35/100")).toBeTruthy();

    // Verifica horas por categoria
    expect(getByText("Horas por categoria")).toBeTruthy();
    expect(getByText("Categoria A: 20 / 50")).toBeTruthy();
    expect(getByText("Categoria B: 15 / 40")).toBeTruthy();

    // Verifica cabeçalho da tabela de documentos
    expect(getByText("Categoria")).toBeTruthy();
    expect(getByText("Atividade")).toBeTruthy();
    expect(getByText("Tipo")).toBeTruthy();
    expect(getByText("Horas")).toBeTruthy();
    expect(getByText("Observação")).toBeTruthy();
    expect(getByText("Link")).toBeTruthy();

    // Verifica linhas de documentos (devem estar ordenadas por categoria no código)
    const rows = getAllByTestId("document-row");
    // 3 cabeçalhos + 3 documentos = 6 linhas com testID
    // A ordem de renderização pode variar, então verificamos a presença dos dados
    expect(getByText("Categoria A")).toBeTruthy();
    expect(getByText("Atividade A1")).toBeTruthy();
    expect(getByText("-")).toBeTruthy(); // Tipo undefined
    expect(getByText("20")).toBeTruthy();
    // Observação undefined não deve ser renderizada diretamente como texto, mas a célula sim
    expect(getByText("linkA1")).toBeTruthy();

    expect(getAllByText("Categoria B")).toBeTruthy(); // Deve aparecer 2x
    expect(getByText("Atividade B1")).toBeTruthy();
    expect(getByText("Tipo X")).toBeTruthy();
    expect(getByText("10")).toBeTruthy();
    expect(getByText("Obs B1")).toBeTruthy();
    expect(getByText("linkB1")).toBeTruthy();

    expect(getByText("Atividade B2")).toBeTruthy();
    expect(getByText("Tipo Y")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
    expect(getByText("Obs B2")).toBeTruthy();
    expect(getByText("linkB2")).toBeTruthy();

    // Verifica botão de exportar
    expect(getByText("Exportar")).toBeTruthy();
  });

  it("deve chamar gerarPDFComNome ao pressionar o botão Exportar", () => {
    const { getByText } = render(<PDFScreen />);
    const exportButton = getByText("Exportar");

    fireEvent.press(exportButton);

    expect(mockGerarPDFComNome).toHaveBeenCalledTimes(1);
  });

  // Teste adicional: Verificar a ordenação (mais complexo)
  it("deve renderizar as linhas dos documentos ordenadas por categoria", () => {
    const { getAllByTestId } = render(<PDFScreen />);
    const rows = getAllByTestId("document-row");

    // Extrai o texto da primeira célula (Categoria) de cada linha de dados
    // Ignora as 3 primeiras linhas que são cabeçalhos/totais
    const renderedCategories = rows.slice(3).map(row => {
      // Acessa os filhos da linha mockada para encontrar a célula da categoria
      // Isso depende da estrutura do mock de S.Row e S.Cell
      // Uma abordagem mais robusta usaria testIDs específicos nas células
      const cells = row.props.children;
      return cells[0].props.children; // Assume que a primeira célula é a categoria
    });

    expect(renderedCategories).toEqual(["Categoria A", "Categoria B", "Categoria B"]);
  });

  it("deve lidar com listas vazias de documentos e categorias", () => {
    // Sobrescreve o mock do contexto para este teste
    (useDocumentsContext as jest.Mock).mockImplementation(() => ({
      ...mockUseDocumentsContext,
      documents: [],
      hourByCategory: [],
      hourTotal: 0,
    }));

    const { getByText, queryByText, getAllByTestId } = render(<PDFScreen />);

    expect(getByText("0/100")).toBeTruthy();
    expect(queryByText(/Categoria A:/)).toBeNull();
    expect(queryByText(/Categoria B:/)).toBeNull();

    // Verifica que apenas as linhas de cabeçalho/totais existem
    const rows = getAllByTestId("document-row");
    expect(rows.length).toBe(3); // Apenas as 3 linhas de cabeçalho/totais
  });
});
