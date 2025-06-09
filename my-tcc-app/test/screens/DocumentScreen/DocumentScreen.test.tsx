import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import DocumentScreen from "../../../src/screens/DocumentScreen";
import { useNavigation } from "@react-navigation/native";
import { useDocumentsContext } from "../../../src/context/documentsContext";

jest.mock("../../../src/context/documentsContext", () => ({
  useDocumentsContext: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@expo/vector-icons/AntDesign", () => {
  return () => "";
});
describe("DocumentScreen", () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar EmptyDocument quando não há documentos", () => {
    (useDocumentsContext as jest.Mock).mockReturnValue({
      documents: [],
      getDocumentsList: jest.fn(),
    });

    render(<DocumentScreen />);

    expect(screen.getByTestId("empty-document")).toBeTruthy();
  });

  it("deve renderizar a FlatList quando há documentos", () => {
    const mockDocuments = [
      {
        id: "1",
        atividade: "Atividade 1",
        categoria: "Categoria A",
        horas: 2,
        tipo: "Tipo X",
      },
    ];

    (useDocumentsContext as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      getDocumentsList: jest.fn(),
    });

    render(<DocumentScreen />);

    expect(screen.getAllByTestId("document-card-container")).toBeTruthy();
    expect(screen.queryByTestId("empty-document")).toBeNull();
  });

  it("deve chamar navigate ao pressionar o botão de adicionar", () => {
    (useDocumentsContext as jest.Mock).mockReturnValue({
      documents: [],
      getDocumentsList: jest.fn(),
    });

    render(<DocumentScreen />);

    const addButton = screen.getByTestId("add-button");
    fireEvent.press(addButton);

    expect(navigateMock).toHaveBeenCalledWith("Documento", {});
  });
});
