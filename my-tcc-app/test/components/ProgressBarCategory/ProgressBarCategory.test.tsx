import React from "react";
import { render, screen } from "@testing-library/react-native";
import ProgressBarCategory from "../../../src/components/ProgressBarCategory";
describe("ProgressBarCategory Component", () => {
  const basicProps = {
    currentValue: 30,
    maxValue: 100,
    categoryName: "Desenvolvimento",
  };

  it("renderiza corretamente com todas as props", () => {
    render(<ProgressBarCategory {...basicProps} />);

    expect(screen.getByText("Desenvolvimento")).toBeTruthy();
    expect(screen.getByText("30/100")).toBeTruthy();
    expect(screen.getByTestId("bar-fill")).toHaveStyle({ width: "30%" });
  });

  it("calcula corretamente a porcentagem (arredondamento)", () => {
    const { rerender } = render(
      <ProgressBarCategory
        currentValue={7}
        maxValue={9}
      />,
    );

    expect(screen.getByTestId("bar-fill")).toHaveStyle({ width: "77.77777777777779%" });

    rerender(
      <ProgressBarCategory
        currentValue={150}
        maxValue={100}
      />,
    );
    expect(screen.getByTestId("bar-fill")).toHaveStyle({ width: "100%" });
  });

  it("não exibe o título quando categoryName não é fornecido", () => {
    render(
      <ProgressBarCategory
        currentValue={30}
        maxValue={100}
      />,
    );
    expect(screen.queryByTestId("category-title")).toBeNull();
  });

  it("aplica estilo correto na barra de progresso", () => {
    render(<ProgressBarCategory {...basicProps} />);
    const barFill = screen.getByTestId("bar-fill");

    expect(barFill.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#A3A3CC", height: "100%", width: "30%" }),
    );
  });
});
