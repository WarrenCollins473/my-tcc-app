import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import DocumentCard from "../../../src/components/DocumentCard";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native");

describe("DocumentCard Component", () => {
  const mockProps = {
    atividade: "Desenvolvimento de App",
    categoria: "Programação",
    horas: 10,
    id: 1,
  };

  it("renderiza corretamente os dados obrigatórios", () => {
    render(<DocumentCard {...mockProps} />);

    expect(screen.getByText("Categoria")).toBeTruthy();
    expect(screen.getByText("Programação")).toBeTruthy();
    expect(screen.getByText("Atividade")).toBeTruthy();
    expect(screen.getByText("Desenvolvimento de App")).toBeTruthy();
    expect(screen.getByText("Horas")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
  });

  it("não renderiza o campo 'Tipo' quando não fornecido", () => {
    render(<DocumentCard {...mockProps} />);
    expect(screen.queryByText("Tipo")).toBeNull();
  });

  it("renderiza o campo 'Tipo' quando fornecido", () => {
    render(
      <DocumentCard
        {...mockProps}
        tipo="Extensão"
      />,
    );
    expect(screen.getByText("Tipo")).toBeTruthy();
    expect(screen.getByText("Extensão")).toBeTruthy();
  });

  it("navega para a tela 'Documento' ao ser clicado", () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    render(<DocumentCard {...mockProps} />);
    fireEvent.press(screen.getByTestId("document-card-container"));

    expect(mockNavigate).toHaveBeenCalledWith("Documento", { itemId: 1 });
  });
});
