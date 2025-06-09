import React from "react";
import { render, screen, within } from "@testing-library/react-native";
import DrawerRoute from "../../src/navigation/drawer.routes";

// Variável para capturar props passadas para o Navigator mockado
let capturedNavigatorProps: { screenOptions?: any; [key: string]: any } = {};

// Mock para @react-navigation/drawer
jest.mock("@react-navigation/drawer", () => {
  const ActualReact = require("react"); // Para JSX dentro deste mock
  const { View, Text } = require("react-native"); // Importa View e Text AQUI
  // Componentes mock para Navigator e Screen
  const MockNavigator: React.FC<any> = ({ children, screenOptions, ...rest }) => {
    capturedNavigatorProps = { screenOptions, ...rest }; // Captura as props
    return <View testID="MockDrawerNavigator">{children}</View>;
  };

  const MockScreen: React.FC<any> = ({ name, component: Component, options }) => {
    return (
      <View testID={`mock-screen-${name}`}>
        <View testID={`mock-screen-name-${name}`}>{name}</View>
        {/* Renderiza o componente mockado da tela */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        {Component && <Component />}
        {/* Renderiza o headerTitle se fornecido */}
        {options?.headerTitle && <View testID={`mock-headerTitle-${name}`}>{options.headerTitle}</View>}
        {/* Renderiza o drawerIcon se fornecido, chamando a função do ícone */}
        {options?.drawerIcon && (
          <View testID={`mock-drawerIconContainer-${name}`}>
            {options.drawerIcon({ focused: false, color: "mock-color-prop", size: 20 })}
          </View>
        )}
      </View>
    );
  };

  return {
    createDrawerNavigator: () => ({
      Navigator: MockNavigator,
      Screen: MockScreen,
    }),
  };
});

// Mock para as telas filhas
// Ajuste os caminhos conforme a estrutura do seu projeto
jest.mock("../../src/screens/HourScreen", () => {
  const ActualReact = require("react"); // Para JSX dentro deste mock
  const { View, Text } = require("react-native"); // Importa View e Text AQUI
  const MockHourScreen = () => <View testID="HourScreenContent">HourScreenMock</View>;
  MockHourScreen.displayName = "HourScreen";
  return MockHourScreen;
});

jest.mock("../../src/navigation/stack.routes", () => {
  const ActualReact = require("react"); // Para JSX dentro deste mock
  const { View, Text } = require("react-native"); // Importa View e Text AQUI
  // Assumindo que stack.routes está no mesmo diretório de DrawerRoute
  const MockStackRoute = () => <View testID="StackRouteContent">StackRouteMock</View>;
  MockStackRoute.displayName = "StackRoute";
  return MockStackRoute;
});

jest.mock("../../src/screens/PDFScreen", () => {
  const ActualReact = require("react"); // Para JSX dentro deste mock
  const { View, Text } = require("react-native"); // Importa View e Text AQUI
  const MockPDFScreen = () => <View testID="PDFScreenContent">PDFScreenMock</View>;
  MockPDFScreen.displayName = "PDFScreen";
  return MockPDFScreen;
});

// Mock para ícones do @expo/vector-icons
jest.mock(
  "@expo/vector-icons/AntDesign",
  () =>
    ({ name, size, color }: { name: string; size: number; color: string }) => {
      const ActualReact = require("react"); // Para JSX dentro deste mock
      const { View, Text } = require("react-native"); // Importa View e Text AQUI

      <View
        testID="AntDesignIcon"
        data-name={name}
        data-size={size}
        data-color={color}
      >
        {`Icon-${name}`}
      </View>;
    },
);

// Mock para o tema
// Isso garante que defaultTheme.colors.background e .primary tenham valores definidos para o teste.
// Ajuste o caminho para o seu arquivo de tema.
jest.mock("../../src/theme/DefautTheme", () => ({
  defaultTheme: {
    colors: {
      background: "mockBackgroundColorValue", // Ex: '#FFFFFF'
      primary: "mockPrimaryColorValue", // Ex: '#0000FF'
    },
  },
}));
// Importa o tema mockado para usar seus valores nas asserções
const mockedTheme = require("../../src/theme/DefautTheme").defaultTheme;

describe("DrawerRoute", () => {
  beforeEach(() => {
    // Limpa as props capturadas antes de cada teste
    capturedNavigatorProps = {};
  });

  it("deve renderizar o Drawer Navigator", () => {
    render(<DrawerRoute />);
    expect(screen.getByTestId("MockDrawerNavigator")).toBeTruthy();
  });

  it("deve configurar as screenOptions globais para o Drawer Navigator corretamente", () => {
    render(<DrawerRoute />);
    const { screenOptions } = capturedNavigatorProps;

    expect(screenOptions).toBeDefined();
    expect(screenOptions.drawerActiveTintColor).toBe(mockedTheme.colors.background);
    expect(screenOptions.drawerInactiveTintColor).toBe(mockedTheme.colors.background);
    expect(screenOptions.headerTitleAlign).toBe("center");
    expect(screenOptions.headerStyle).toEqual({
      backgroundColor: mockedTheme.colors.primary,
    });
    expect(screenOptions.headerTintColor).toBe(mockedTheme.colors.background);
    expect(screenOptions.headerTitleStyle).toEqual({
      fontWeight: "bold",
      color: mockedTheme.colors.background,
      textAlign: "center",
    });
    expect(screenOptions.drawerStyle).toEqual({
      backgroundColor: mockedTheme.colors.primary,
    });
    expect(screenOptions.headerShadowVisible).toBe(false);
  });

  // Testes para cada tela configurada
  describe("Tela: Minhas Horas", () => {
    const screenName = "Minhas Horas";
    const iconName = "clockcircleo";

    it(`renderiza o placeholder da tela "${screenName}"`, () => {
      render(<DrawerRoute />);
      const screenElement = screen.getByTestId(`mock-screen-${screenName}`);
      expect(screenElement).toBeTruthy();
      // Verifica se o componente mockado da tela é renderizado
      expect(within(screenElement).getByTestId("HourScreenContent")).toBeTruthy();
    });

    it(`configura o headerTitle para "${screenName}"`, () => {
      render(<DrawerRoute />);
      const headerTitleElement = screen.getByTestId(`mock-headerTitle-${screenName}`);
      expect(headerTitleElement.props.children).toBe(screenName);
    });

    // it(`configura o drawerIcon para "${screenName}" com o ícone AntDesign correto`, () => {
    //   render(<DrawerRoute />);
    //   const iconContainer = screen.getByTestId(`mock-drawerIconContainer-${screenName}`);
    //   // Verifica se o mock do AntDesignIcon é renderizado dentro do container do ícone
    //   const iconElement = within(iconContainer).getByTestId("AntDesignIcon");
    //   expect(iconElement.props["data-name"]).toBe(iconName);
    //   expect(iconElement.props["data-size"]).toBe(20);
    //   // A cor do ícone é definida diretamente na função drawerIcon no componente,
    //   // usando defaultTheme.colors.background.
    //   expect(iconElement.props["data-color"]).toBe(mockedTheme.colors.background);
    // });
  });

  describe("Tela: Documentos", () => {
    const screenName = "Documentos";
    const iconName = "file1";

    it(`renderiza o placeholder da tela "${screenName}"`, () => {
      render(<DrawerRoute />);
      const screenElement = screen.getByTestId(`mock-screen-${screenName}`);
      expect(screenElement).toBeTruthy();
      expect(within(screenElement).getByTestId("StackRouteContent")).toBeTruthy();
    });

    it(`configura o headerTitle para "${screenName}"`, () => {
      render(<DrawerRoute />);
      const headerTitleElement = screen.getByTestId(`mock-headerTitle-${screenName}`);
      expect(headerTitleElement.props.children).toBe(screenName);
    });

    // it(`configura o drawerIcon para "${screenName}" com o ícone AntDesign correto`, () => {
    //   render(<DrawerRoute />);
    //   const iconContainer = screen.getByTestId(`mock-drawerIconContainer-${screenName}`);
    //   const iconElement = within(iconContainer).getByTestId("AntDesignIcon");
    //   expect(iconElement.props["data-name"]).toBe(iconName);
    //   expect(iconElement.props["data-size"]).toBe(20);
    //   expect(iconElement.props["data-color"]).toBe(mockedTheme.colors.background);
    // });
  });

  describe("Tela: Gerar PDF", () => {
    const screenName = "Gerar PDF";
    const iconName = "download";

    it(`renderiza o placeholder da tela "${screenName}"`, () => {
      render(<DrawerRoute />);
      const screenElement = screen.getByTestId(`mock-screen-${screenName}`);
      expect(screenElement).toBeTruthy();
      expect(within(screenElement).getByTestId("PDFScreenContent")).toBeTruthy();
    });

    it(`configura o headerTitle para "${screenName}"`, () => {
      render(<DrawerRoute />);
      const headerTitleElement = screen.getByTestId(`mock-headerTitle-${screenName}`);
      expect(headerTitleElement.props.children).toBe(screenName);
    });

    // it(`configura o drawerIcon para "${screenName}" com o ícone AntDesign correto`, () => {
    //   render(<DrawerRoute />);
    //   const iconContainer = screen.getByTestId(`mock-drawerIconContainer-${screenName}`);
    //   const iconElement = within(iconContainer).getByTestId("AntDesignIcon");
    //   expect(iconElement.props["data-name"]).toBe(iconName);
    //   expect(iconElement.props["data-size"]).toBe(20);
    //   expect(iconElement.props["data-color"]).toBe(mockedTheme.colors.background);
    // });
  });
});
