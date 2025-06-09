import React from "react";
import { render, screen } from "@testing-library/react-native";
import ProgressBarTotal from "../../../src/components/ProgressBarTotal";

describe("ProgressBarTotal Component", () => {
  const basicProps = {
    currentValue: 75,
    maxValue: 100,
  };

  it("renderiza corretamente todos os elementos", () => {
    render(<ProgressBarTotal {...basicProps} />);

    expect(screen.getByTestId("container")).toBeTruthy();
    expect(screen.getByText("Total de Horas")).toBeTruthy();
    expect(screen.getByText("75/100")).toBeTruthy();
    expect(screen.getByTestId("bar-fill")).toBeTruthy();
  });

  it("calcula a porcentagem corretamente", () => {
    render(<ProgressBarTotal {...basicProps} />);
    const barFill = screen.getByTestId("bar-fill");

    expect(barFill).toHaveStyle({ width: "75%" });
  });

  it("não excede 100% mesmo quando currentValue > maxValue", () => {
    render(
      <ProgressBarTotal
        currentValue={150}
        maxValue={100}
      />,
    );
    const barFill = screen.getByTestId("bar-fill");

    expect(barFill).toHaveStyle({ width: "100%" });
  });

  it("mostra os valores corretamente formatados", () => {
    render(
      <ProgressBarTotal
        currentValue={37.5}
        maxValue={50}
      />,
    );

    expect(screen.getByText("37.5/50")).toBeTruthy();
    const barFill = screen.getByTestId("bar-fill");
    expect(barFill).toHaveStyle({ width: "75%" });
  });

  it("renderiza corretamente quando currentValue é 0", () => {
    render(
      <ProgressBarTotal
        currentValue={0}
        maxValue={100}
      />,
    );

    expect(screen.getByText("0/100")).toBeTruthy();
    const barFill = screen.getByTestId("bar-fill");
    expect(barFill).toHaveStyle({ width: "0%" });
  });
});
