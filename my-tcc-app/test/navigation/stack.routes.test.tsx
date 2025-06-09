import React from "react";
import { render, screen, within } from "@testing-library/react-native";
// Ajuste o caminho para o seu componente StackRoute
// Se o teste estiver em src/routes/__tests__/StackRoute.test.tsx e StackRoute.tsx em src/routes/StackRoute.tsx:
import StackRoute from "../../src/navigation/stack.routes";

// Variável para capturar props do Stack.Navigator mockado
let capturedNavigatorPropsStack: { screenOptions?: any; [key: string]: any } = {};

// Mock para @react-navigation/stack
jest.mock("@react-navigation/stack", () => {
  const ActualReact = require("react");
  const { View } = require("react-native"); // Usaremos View para os mocks

  const MockStackNavigatorComponent: React.FC<any> = ({ children, screenOptions, ...rest }) => {
    // Captura as props para verificação no teste
    capturedNavigatorPropsStack = { screenOptions, ...rest };
    return <View testID="MockStackNavigator">{children}</View>;
  };

  const MockStackScreenComponent: React.FC<any> = ({ name, component: Component }) => {
    // O StackRoute não passa 'options' individuais para as Stack.Screen,
    // então não precisamos simular a renderização de options aqui.
    return (
      <View testID={`mock-stack-screen-${name}`}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        {Component && <Component />}
      </View>
    );
  };

  return {
    // Retorna uma função que simula createStackNavigator
    createStackNavigator: () => ({
      Navigator: MockStackNavigatorComponent,
      Screen: MockStackScreenComponent,
    }),
  };
});

// Mocks para as telas
// O componente StackRoute.tsx importa as telas de "../screens/"

jest.mock(`../../src/screens/DocumentScreen`, () => {
  const ActualReact = require("react");
  const { View, Text } = require("react-native");
  const MockDocumentScreen = () => (
    <View testID="DocumentScreenContent">
      <Text>DocumentScreenMock</Text>
    </View>
  );
  MockDocumentScreen.displayName = "DocumentScreen";
  return MockDocumentScreen;
});

jest.mock(`../../src/screens/DocumentDetails`, () => {
  const ActualReact = require("react");
  const { View, Text } = require("react-native");
  const MockDocumentDetails = () => (
    <View testID="DocumentDetailsContent">
      <Text>DocumentDetailsMock</Text>
    </View>
  );
  MockDocumentDetails.displayName = "DocumentDetails";
  return MockDocumentDetails;
});

describe("StackRoute", () => {
  beforeEach(() => {
    // Limpa as props capturadas antes de cada teste para evitar vazamento entre testes
    capturedNavigatorPropsStack = {};
  });

  it("deve renderizar o Stack Navigator", () => {
    render(<StackRoute />);
    expect(screen.getByTestId("MockStackNavigator")).toBeTruthy();
  });

  it("deve configurar screenOptions para o Stack Navigator com headerShown: false", () => {
    render(<StackRoute />);
    // Verifica se as screenOptions foram passadas para o mock do Navigator
    expect(capturedNavigatorPropsStack.screenOptions).toBeDefined();
    expect(capturedNavigatorPropsStack.screenOptions.headerShown).toBe(false);
  });

  describe("Configuração da Tela: Home", () => {
    const expectedScreenName = "Home";

    it(`deve registrar a tela "${expectedScreenName}"`, () => {
      render(<StackRoute />);
      // Verifica se o mock da tela "Home" é renderizado
      const screenElement = screen.getByTestId(`mock-stack-screen-${expectedScreenName}`);
      expect(screenElement).toBeTruthy();

      // Verifica se o componente mockado DocumentScreen (que tem testID "DocumentScreenContent")
      // é renderizado dentro do mock da tela "Home".
      expect(within(screenElement).getByTestId("DocumentScreenContent")).toBeTruthy();
    });
  });

  describe("Configuração da Tela: Documento", () => {
    const expectedScreenName = "Documento";

    it(`deve registrar a tela "${expectedScreenName}"`, () => {
      render(<StackRoute />);
      // Verifica se o mock da tela "Documento" é renderizado
      const screenElement = screen.getByTestId(`mock-stack-screen-${expectedScreenName}`);
      expect(screenElement).toBeTruthy();

      // Verifica se o componente mockado DocumentDetails (que tem testID "DocumentDetailsContent")
      // é renderizado dentro do mock da tela "Documento".
      expect(within(screenElement).getByTestId("DocumentDetailsContent")).toBeTruthy();
    });
  });
});
