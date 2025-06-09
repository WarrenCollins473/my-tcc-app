import React from "react";
import { render } from "@testing-library/react-native";
import CircularLoading from "../../../src/components/CircularLoading";
import { ActivityIndicator } from "react-native";
import { defaultTheme } from "../../../src/theme/DefautTheme";

describe("CircularLoading", () => {
  it("deve renderizar um ActivityIndicator com as propriedades corretas", () => {
    const { getByTestId } = render(<CircularLoading />);

    const activity = getByTestId("activity-indicator");

    expect(activity).toBeTruthy();
    expect(activity.props.color).toBe(defaultTheme.colors.primary);
    expect(activity.props.size).toBe(80);
  });
});
