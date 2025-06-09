import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react-native";
import { useDocumentDetails } from "../../src/hooks/useDocumentDetails"; // Ajuste o caminho se necessário
import { useDocumentsContext } from "../../src/context/documentsContext";
import { useDocumentDatabase } from "../../src/service/useDocumentDatabase";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { Barema } from "../../src/models/barema"; // Ajuste o caminho se necessário

// --- Mocks ---

// Mock react-native Alert
const mockAlert = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

// Mock navigation
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

// Mock database hook
const mockGetDocumentById = jest.fn();
jest.mock("../../src/service/useDocumentDatabase", () => ({
  useDocumentDatabase: () => ({
    getDocumentById: mockGetDocumentById,
  }),
}));

// Mock documents context
const mockDeleteDocument = jest.fn();
const mockCreateDocument = jest.fn();
const mockUpdateDocument = jest.fn();

// Estrutura de exemplo para Barema - ajuste conforme seu modelo real
const mockBarema: Barema = {
  categorias: [
    {
      nome: "Categoria 1",
      atividades: [
        {
          nome: "Atividade 1.1",
          carga_individual: 10,
          carga_maxima: 50,
          tipos: [
            { nome: "Tipo A", carga_individual: 5, carga_maxima: 20 },
            { nome: "Tipo B", carga_individual: 8, carga_maxima: 30 },
          ],
        },
        {
          nome: "Atividade 1.2",
          carga_individual: 15,
          carga_maxima: 60,
        },
      ],
      limite_categoria: 100,
    },
    {
      nome: "Categoria 2",
      atividades: [
        {
          nome: "Atividade 2.1",
          carga_individual: 20,
          carga_maxima: 100,
        },
      ],
      limite_categoria: 100,
    },
  ],
  total_minimo: 200,
};
jest.mock("../../src/context/documentsContext", () => ({
  useDocumentsContext: () => ({
    barema: mockBarema,
    deleteDocument: mockDeleteDocument,
    createDocument: mockCreateDocument,
    updateDocument: mockUpdateDocument,
  }),
}));

// --- Test Suite ---

describe("useDocumentDetails Hook", () => {
  const itemId = 123;
  const mockDocument = {
    id: itemId,
    categoria: "Categoria 1",
    atividade: "Atividade 1.1",
    tipo: "Tipo A",
    observacao: "Observação inicial",
    link: "http://example.com",
    horas: 15, // Horas lançadas inicialmente
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations if they were changed in specific tests
    mockGetDocumentById.mockResolvedValue([mockDocument]); // Default mock for loading
    mockAlert.mockImplementation((title, message, buttons) => {
      // Default mock: does nothing, useful for tests not checking alert interaction
    });
  });

  // Teste 1: Estado inicial sem itemId (Modo Criação)
  it("deve inicializar com valores padrão quando nenhum itemId é fornecido", () => {
    const { result } = renderHook(() => useDocumentDetails(undefined));

    expect(result.current.categoria).toBe("");
    expect(result.current.atividade).toBe("");
    expect(result.current.tipo).toBe("");
    expect(result.current.horasLancadas).toBe("");
    expect(result.current.observacao).toBe("");
    expect(result.current.link).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.horasObtidas).toBe("0");
    expect(result.current.cargaHorariaIndividual).toBe(0);
    expect(result.current.cargaHorariaMaxima).toBe(0);
    expect(result.current.categoriaErro).toBe(false);
    expect(result.current.atividadeErro).toBe(false);
    expect(result.current.horasLancadasErro).toBe(false);
    expect(result.current.tipoErro).toBe(false);
    expect(result.current.linkErro).toBe(false);
    expect(mockGetDocumentById).not.toHaveBeenCalled();
  });

  // Teste 2: Estado inicial com itemId (Modo Edição)
  it("deve carregar os dados do documento quando itemId é fornecido", async () => {
    const { result } = renderHook(() => useDocumentDetails(itemId));

    expect(mockGetDocumentById).toHaveBeenCalledWith(itemId);

    // Espera a conclusão do carregamento (efeito assíncrono)
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.categoria).toBe(mockDocument.categoria);
    expect(result.current.atividade).toBe(mockDocument.atividade);
    expect(result.current.tipo).toBe(mockDocument.tipo);
    expect(result.current.observacao).toBe(mockDocument.observacao);
    expect(result.current.link).toBe(mockDocument.link);
    expect(result.current.horasLancadas).toBe(mockDocument.horas.toString());
    // Verifica se cargas horárias e horas obtidas foram calculadas corretamente no load
    expect(result.current.cargaHorariaIndividual).toBe(5); // Carga do Tipo A
    expect(result.current.cargaHorariaMaxima).toBe(20); // Carga do Tipo A
    // calcularHora(18, 5, 20) -> min(20, floor(18/5)*5) -> min(20, 3*5) -> 15
    expect(result.current.horasObtidas).toBe("15");
  });

  // Teste 3: Manipulação de mudanças de input
  describe("Manipulação de Input", () => {
    it("deve atualizar estados simples com setters", () => {
      const { result } = renderHook(() => useDocumentDetails(undefined));

      act(() => result.current.setCategoria("Nova Categoria"));
      expect(result.current.categoria).toBe("Nova Categoria");

      act(() => result.current.setObservacao("Nova Observação"));
      expect(result.current.observacao).toBe("Nova Observação");

      act(() => result.current.setLink("http://new.com"));
      expect(result.current.link).toBe("http://new.com");
    });

    it("handleAtividadeChange deve atualizar atividade, cargas horárias e resetar horasObtidas", () => {
      const { result } = renderHook(() => useDocumentDetails(undefined));

      act(() => result.current.setCategoria("Categoria 1"));
      act(() => result.current.handleAtividadeChange("Atividade 1.2", mockBarema, "Categoria 1"));

      expect(result.current.atividade).toBe("Atividade 1.2");
      expect(result.current.cargaHorariaIndividual).toBe(15);
      expect(result.current.cargaHorariaMaxima).toBe(60);
      expect(result.current.horasObtidas).toBe("0");
    });

    it("handleTipoChange deve atualizar tipo, cargas horárias e resetar horasObtidas", () => {
      const { result } = renderHook(() => useDocumentDetails(undefined));

      act(() => result.current.setCategoria("Categoria 1"));
      act(() => result.current.handleAtividadeChange("Atividade 1.1", mockBarema, "Categoria 1"));
      act(() => result.current.handleTipoChange("Tipo B", "Atividade 1.1", "Categoria 1", mockBarema));

      expect(result.current.tipo).toBe("Tipo B");
      expect(result.current.cargaHorariaIndividual).toBe(8);
      expect(result.current.cargaHorariaMaxima).toBe(30);
      expect(result.current.horasObtidas).toBe("0");

      // Volta para 'Nenhum' (ou valor inválido), deve pegar da atividade
      act(() => result.current.handleTipoChange("Nenhum", "Atividade 1.1", "Categoria 1", mockBarema));
      expect(result.current.tipo).toBe("Nenhum");
      expect(result.current.cargaHorariaIndividual).toBe(10); // Volta para Atividade 1.1
      expect(result.current.cargaHorariaMaxima).toBe(50); // Volta para Atividade 1.1
      expect(result.current.horasObtidas).toBe("0");
    });

    it("handleHorasLancadasChange deve atualizar horasLancadas e calcular horasObtidas", () => {
      const { result } = renderHook(() => useDocumentDetails(undefined));

      act(() => result.current.setCategoria("Categoria 1"));
      act(() => result.current.handleAtividadeChange("Atividade 1.1", mockBarema, "Categoria 1"));
      act(() => result.current.handleTipoChange("Tipo A", "Atividade 1.1", "Categoria 1", mockBarema)); // individual: 5, maxima: 20

      act(() => {
        result.current.handleHorasLancadasChange("18");
      });
      expect(result.current.horasLancadas).toBe("18");
      // calcularHora(18, 5, 20) -> min(20, floor(18/5)*5) -> min(20, 3*5) -> 15
      expect(result.current.horasObtidas).toBe("15");

      act(() => {
        result.current.handleHorasLancadasChange("abc");
      }); // Valor inválido
      expect(result.current.horasLancadas).toBe("abc");
      expect(result.current.horasObtidas).toBe("0"); // calcularHora(NaN, ...) -> 0

      act(() => {
        result.current.handleHorasLancadasChange("5");
      });
      expect(result.current.horasLancadas).toBe("5");
      // calcularHora(5, 5, 20) -> min(20, floor(5/5)*5) -> min(20, 1*5) -> 5
      expect(result.current.horasObtidas).toBe("5");

      act(() => {
        result.current.handleHorasLancadasChange("25");
      });
      expect(result.current.horasLancadas).toBe("25");
      // calcularHora(25, 5, 20) -> min(20, floor(25/5)*5) -> min(20, 5*5) -> 20
      expect(result.current.horasObtidas).toBe("20");
    });
  });

  // Teste 4: Submissão (Criação) bem-sucedida
  it("handleSubmit deve chamar createDocument e navegar de volta em caso de sucesso", async () => {
    const { result } = renderHook(() => useDocumentDetails(undefined));

    // Define estado válido
    act(() => result.current.setCategoria("Categoria 2"));
    act(() => result.current.handleAtividadeChange("Atividade 2.1", mockBarema, "Categoria 2")); // individual: 20, maxima: 100
    act(() => {
      result.current.handleHorasLancadasChange("45");
    }); // Obtidas: 40
    act(() => result.current.setObservacao("Obs Teste"));
    act(() => result.current.setLink("http://submit.com"));
    // Não precisa de tipo para Atividade 2.1

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockCreateDocument).toHaveBeenCalledTimes(1);
    expect(mockCreateDocument).toHaveBeenCalledWith({
      categoria: "Categoria 2",
      atividade: "Atividade 2.1",
      tipo: "", // Tipo não aplicável/selecionado
      observacao: "Obs Teste",
      link: "http://submit.com",
      horas: 40, // Horas obtidas calculadas
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockAlert).not.toHaveBeenCalled();
    expect(result.current.categoriaErro).toBe(false);
    expect(result.current.atividadeErro).toBe(false);
    expect(result.current.horasLancadasErro).toBe(false);
    expect(result.current.tipoErro).toBe(false);
    expect(result.current.linkErro).toBe(false);
  });

  // Teste 5: Submissão (Criação) com erros de validação
  it("handleSubmit deve mostrar alerta e setar erros se a validação falhar", async () => {
    const { result } = renderHook(() => useDocumentDetails(undefined));

    // Estado inválido (campos faltando)
    act(() => result.current.setCategoria("Categoria 1")); // Falta atividade, horas, link
    // Atividade 1.1 tem tipo, então tipo também será obrigatório
    act(() => result.current.handleAtividadeChange("Atividade 1.1", mockBarema, "Categoria 1"));
    act(() => result.current.setTipo("Nenhum")); // Tipo inválido

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockAlert).toHaveBeenCalled();
    expect(mockCreateDocument).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();

    // Verifica quais erros foram setados
    expect(result.current.categoriaErro).toBe(false); // Categoria foi preenchida
    expect(result.current.atividadeErro).toBe(false); // Atividade foi preenchida
    expect(result.current.tipoErro).toBe(true); // Tipo é obrigatório e está 'Nenhum'/' '
    expect(result.current.horasLancadasErro).toBe(true); // Horas não foram preenchidas (horasObtidas <= 0)
    expect(result.current.linkErro).toBe(true); // Link não foi preenchido
  });

  // Teste 6: Atualização (Edição) bem-sucedida
  it("handleUpdate deve chamar updateDocument e navegar de volta em caso de sucesso", async () => {
    const { result } = renderHook(() => useDocumentDetails(itemId));

    // Espera carregar dados iniciais
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Modifica um campo
    const novaObservacao = "Observação Atualizada";
    act(() => result.current.setObservacao(novaObservacao));
    // Modifica horas para recalcular horas obtidas
    act(() => {
      result.current.handleHorasLancadasChange("12");
    }); // Obtidas: 10 (min(20, floor(12/5)*5))

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(mockUpdateDocument).toHaveBeenCalledTimes(1);
    expect(mockUpdateDocument).toHaveBeenCalledWith({
      id: itemId,
      categoria: mockDocument.categoria,
      atividade: mockDocument.atividade,
      tipo: mockDocument.tipo,
      observacao: novaObservacao, // Campo atualizado
      link: mockDocument.link,
      horas: 10, // Horas obtidas recalculadas
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockAlert).not.toHaveBeenCalled();
  });

  // Teste 6.1: Atualização (Edição) com erros de validação
  it("handleUpdate deve mostrar alerta e setar erros se a validação falhar", async () => {
    const { result } = renderHook(() => useDocumentDetails(itemId));
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Invalida um campo obrigatório
    act(() => result.current.setLink(""));

    await act(async () => {
      await result.current.handleUpdate();
    });

    expect(mockAlert).toHaveBeenCalled();
    expect(mockUpdateDocument).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(result.current.linkErro).toBe(true);
  });

  // Teste 7: Exclusão
  it("handleDelete deve chamar deleteDocument e navegar de volta após confirmação no alerta", () => {
    // Configura o mock do Alert para simular o clique em 'Excluir'
    mockAlert.mockImplementation((title, message, buttons) => {
      const deleteButton = buttons && buttons.find(btn => btn.style === "destructive");
      if (deleteButton && deleteButton.onPress) {
        deleteButton.onPress(); // Simula o clique
      }
    });

    const { result } = renderHook(() => useDocumentDetails(itemId));

    // Não precisa esperar carregar para deletar

    act(() => {
      result.current.handleDelete(itemId);
    });

    expect(mockAlert).toHaveBeenCalledWith(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este documento?",
      expect.any(Array), // Verifica se os botões foram passados
    );
    expect(mockDeleteDocument).toHaveBeenCalledTimes(1);
    expect(mockDeleteDocument).toHaveBeenCalledWith(itemId);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("handleDelete não deve fazer nada se o usuário cancelar no alerta", () => {
    // Configura o mock do Alert para simular o clique em 'Cancelar'
    mockAlert.mockImplementation((title, message, buttons) => {
      const cancelButton = buttons && buttons.find(btn => btn.style === "cancel");
      if (cancelButton && cancelButton.onPress) {
        cancelButton.onPress(); // Simula o clique
      }
    });

    const { result } = renderHook(() => useDocumentDetails(itemId));

    act(() => {
      result.current.handleDelete(itemId);
    });

    expect(mockAlert).toHaveBeenCalledTimes(1);
    expect(mockDeleteDocument).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  // Teste 8: Função auxiliar - calcularHora (testado indiretamente via handleHorasLancadasChange)
  it("handleHorasLancadasChange deve usar a lógica de calcularHora corretamente", () => {
    const { result } = renderHook(() => useDocumentDetails(undefined));

    act(() => result.current.setCategoria("Categoria 1"));
    act(() => result.current.handleAtividadeChange("Atividade 1.2", mockBarema, "Categoria 1")); // individual: 15, maxima: 60

    // Caso 1: Horas < individual
    act(() => {
      result.current.handleHorasLancadasChange("10");
    });
    expect(result.current.horasObtidas).toBe("0");

    // Caso 2: Horas >= individual, dentro do máximo
    act(() => {
      result.current.handleHorasLancadasChange("35");
    }); // floor(35/15)*15 = 2*15 = 30. min(60, 30) = 30
    expect(result.current.horasObtidas).toBe("30");

    // Caso 3: Horas >= individual, excede o máximo
    act(() => {
      result.current.handleHorasLancadasChange("70");
    }); // floor(70/15)*15 = 4*15 = 60. min(60, 60) = 60
    expect(result.current.horasObtidas).toBe("60");

    // Caso 4: Horas = 0 ou inválido
    act(() => {
      result.current.handleHorasLancadasChange("0");
    });
    expect(result.current.horasObtidas).toBe("0");
    act(() => {
      result.current.handleHorasLancadasChange("invalid");
    });
    expect(result.current.horasObtidas).toBe("0");

    // Caso 5: Máxima é 0 (cenário não presente no mockBarema, mas testando a lógica)
    act(() => result.current.setCargaHorariaMaxima(0));
    act(() => {
      result.current.handleHorasLancadasChange("35");
    }); // Deve retornar 0 se maxima é 0
    expect(result.current.horasObtidas).toBe("0");
  });

  // Teste 9: Função auxiliar - temTipo
  it("temTipo deve retornar true se a atividade/categoria selecionada tiver tipos, false caso contrário", () => {
    const { result } = renderHook(() => useDocumentDetails(undefined));

    // Caso 1: Atividade com tipos
    act(() => result.current.setCategoria("Categoria 1"));
    act(() => result.current.setAtividade("Atividade 1.1"));
    expect(result.current.temTipo(mockBarema)).toBe(true);

    // Caso 2: Atividade sem tipos
    act(() => result.current.setAtividade("Atividade 1.2"));
    expect(result.current.temTipo(mockBarema)).toBe(false);

    // Caso 3: Categoria/Atividade inválida
    act(() => result.current.setCategoria("Categoria Inexistente"));
    expect(result.current.temTipo(mockBarema)).toBe(false);
    act(() => result.current.setCategoria("Categoria 1"));
    act(() => result.current.setAtividade("Atividade Inexistente"));
    expect(result.current.temTipo(mockBarema)).toBe(false);
  });
});
