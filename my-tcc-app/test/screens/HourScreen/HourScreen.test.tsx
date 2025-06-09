import React from "react";
import { render } from "@testing-library/react-native";
import HourScreen from "../../../src/screens/HourScreen";
import { useDocumentsContext } from "../../../src/context/documentsContext";

jest.mock("../../../src/context/documentsContext");
jest.mock("../../../src/components/ProgressBarCategory", () => "ProgressBarCategory");

const mockUseDocumentsContext = useDocumentsContext as jest.Mock;

describe("HourScreen", () => {
  const mockHourByCategory = [
    { categoria: "Ensino", horas: 50, maxHoras: 100 },
    { categoria: "Pesquisa", horas: 30, maxHoras: 80 },
  ];

  beforeEach(() => {
    mockUseDocumentsContext.mockReturnValue({
      hourByCategory: mockHourByCategory,
      hourTotal: 80,
      loading: false,
      barema: { total_minimo: 200 },
      getDocumentsList: jest.fn(),
    });
  });

  it("deve carregar os dados ao montar", () => {
    const mockGetDocumentsList = jest.fn();
    mockUseDocumentsContext.mockReturnValue({
      hourByCategory: mockHourByCategory,
      hourTotal: 80,
      loading: false,
      barema: { total_minimo: 200 },
      getDocumentsList: mockGetDocumentsList,
    });

    render(<HourScreen />);

    expect(mockGetDocumentsList).toHaveBeenCalled();
  });

  it("deve mostrar loading quando estiver carregando", () => {
    mockUseDocumentsContext.mockReturnValue({
      hourByCategory: [],
      hourTotal: 0,
      loading: true,
      getDocumentsList: jest.fn(),
    });

    const { getByTestId } = render(<HourScreen />);

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
  it('deve renderizar o título "Por categoria"', () => {
    const { getByText } = render(<HourScreen />);

    expect(getByText("Por categoria")).toBeTruthy();
  });
});
