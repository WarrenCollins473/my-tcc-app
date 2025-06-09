import React from "react";
import { render, screen } from "@testing-library/react-native";
import EmptyDocument from "../../../src/components/EmptyDocument/index";

describe("EmptyDocument Component", () => {
  it("renderiza corretamente a mensagem padrão", () => {
    render(<EmptyDocument />);

    const message = screen.getByText("Sem documentos cadastrados");
    expect(message).toBeTruthy(); // Verifica se o texto está na tela
  });
});
