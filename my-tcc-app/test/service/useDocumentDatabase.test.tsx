import { useDocumentDatabase } from "../../src/service/useDocumentDatabase"; // Ajuste o caminho
import { useSQLiteContext } from "expo-sqlite";
import { Alert } from "react-native"; // Import Alert directly
import { Document } from "../../src/models/document"; // Ajuste o caminho

// --- Mocks ---

// Mock react-native Alert using jest.spyOn
// Apply the mock directly to the imported Alert object
const mockAlert = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

// Mock expo-sqlite
const mockRunAsync = jest.fn();
const mockGetAllAsync = jest.fn();
const mockGetAllSync = jest.fn();
const mockDb = {
  runAsync: mockRunAsync,
  getAllAsync: mockGetAllAsync,
  getAllSync: mockGetAllSync,
};
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(() => mockDb),
}));

// Mock console.error to avoid polluting test output
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

// --- Test Suite ---

describe("useDocumentDatabase Hook", () => {
  // Clear mocks before each test
  beforeEach(() => {
    // jest.clearAllMocks() clears spies as well
    jest.clearAllMocks();
    // Reset mock implementations to default success states if needed
    mockRunAsync.mockResolvedValue(undefined as any);
    mockGetAllAsync.mockResolvedValue([]);
    mockGetAllSync.mockReturnValue([]);
    // No need to reset mockAlert implementation here unless specific tests change it
  });

  // Restore mocks after all tests
  afterAll(() => {
    consoleErrorSpy.mockRestore();
    mockAlert.mockRestore(); // Restore the original Alert.alert
  });

  // --- Insert Tests ---
  describe("insert", () => {
    const newDocData: Omit<Document, "id"> = {
      categoria: "Test Cat",
      atividade: "Test Act",
      tipo: "Test Type",
      observacao: "Test Obs",
      link: "test.link",
      horas: 10,
    };

    it("deve chamar db.runAsync com a query e os parâmetros corretos", async () => {
      const { insert } = useDocumentDatabase();
      await insert(newDocData);

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      expect(mockRunAsync).toHaveBeenCalledWith(
        "INSERT INTO documento (categoria, atividade, tipo, observacao, link, horas) VALUES (?, ?, ?, ?, ?, ?)",
        ["Test Cat", "Test Act", "Test Type", "Test Obs", "test.link", 10],
      );
    });

    it("deve chamar db.runAsync tratando tipo nulo corretamente", async () => {
      const { insert } = useDocumentDatabase();
      const docSemTipo = { ...newDocData, tipo: undefined };
      await insert(docSemTipo);

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      expect(mockRunAsync).toHaveBeenCalledWith(expect.any(String), [
        "Test Cat",
        "Test Act",
        null,
        "Test Obs",
        "test.link",
        10,
      ]);
    });

    it("deve chamar Alert.alert de sucesso após inserção bem-sucedida", async () => {
      const { insert } = useDocumentDatabase();
      await insert(newDocData);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Sucesso", "Documento salvo com sucesso!");
    });

    it("deve chamar Alert.alert de erro e console.error se db.runAsync falhar", async () => {
      const insertError = new Error("DB Insert Error");
      mockRunAsync.mockRejectedValue(insertError);

      const { insert } = useDocumentDatabase();
      await insert(newDocData);

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Erro", "Erro ao salvar o documento.");
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error creating document:", insertError);
    });
  });

  // --- readAll Tests ---
  describe("readAll", () => {
    it("deve chamar db.getAllAsync com a query correta", async () => {
      const { readAll } = useDocumentDatabase();
      await readAll();

      expect(mockGetAllAsync).toHaveBeenCalledTimes(1);
      expect(mockGetAllAsync).toHaveBeenCalledWith("SELECT * FROM documento");
    });

    it("deve retornar os resultados de db.getAllAsync em caso de sucesso", async () => {
      const mockResult: Document[] = [
        { id: 1, categoria: "A", atividade: "A1", horas: 5, link: "l1", observacao: "", tipo: "" },
      ];
      mockGetAllAsync.mockResolvedValue(mockResult);

      const { readAll } = useDocumentDatabase();
      const result = await readAll();

      expect(result).toEqual(mockResult);
    });

    it("deve retornar array vazio e chamar console.error se db.getAllAsync falhar", async () => {
      const readError = new Error("DB Read Error");
      mockGetAllAsync.mockRejectedValue(readError);

      const { readAll } = useDocumentDatabase();
      const result = await readAll();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error reading documents:", readError);
    });
  });

  // --- deleteDocumentById Tests ---
  describe("deleteDocumentById", () => {
    const docId = 123;
    it("deve chamar db.runAsync com a query e o ID corretos", async () => {
      const { deleteDocumentById } = useDocumentDatabase();
      await deleteDocumentById(docId);

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      expect(mockRunAsync).toHaveBeenCalledWith("DELETE FROM documento WHERE id = ?", [docId]);
    });

    it("deve chamar Alert.alert de sucesso após exclusão bem-sucedida", async () => {
      const { deleteDocumentById } = useDocumentDatabase();
      await deleteDocumentById(docId);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Sucesso", "Documento excluído com sucesso!");
    });

    it("deve chamar Alert.alert de erro e console.error se db.runAsync falhar", async () => {
      const deleteError = new Error("DB Delete Error");
      mockRunAsync.mockRejectedValue(deleteError);

      const { deleteDocumentById } = useDocumentDatabase();
      await deleteDocumentById(docId);

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Erro", "Erro ao excluir o documento.");
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error deleting document:", deleteError);
    });
  });

  // --- updateDocumentById Tests ---
  describe("updateDocumentById", () => {
    const docId = 456;
    const updateData: Partial<Document> = { atividade: "Updated Act", horas: 25 };

    it("deve chamar db.runAsync com a query UPDATE e os parâmetros corretos", async () => {
      const { updateDocumentById } = useDocumentDatabase();
      await updateDocumentById(docId, updateData);

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      expect(mockRunAsync).toHaveBeenCalledWith(
        expect.stringMatching(/^UPDATE documento SET .* WHERE id = \?$/),
        expect.arrayContaining([updateData.atividade, updateData.horas, docId]),
      );
      const generatedQuery = mockRunAsync.mock.calls[0][0];
      expect(generatedQuery).toContain("atividade = ?");
      expect(generatedQuery).toContain("horas = ?");
    });

    it("deve chamar Alert.alert de sucesso após atualização bem-sucedida", async () => {
      const { updateDocumentById } = useDocumentDatabase();
      await updateDocumentById(docId, updateData);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Sucesso", "Documento atualizado com sucesso!");
    });

    it("deve chamar Alert.alert de erro e console.error se db.runAsync falhar", async () => {
      const updateError = new Error("DB Update Error");
      mockRunAsync.mockRejectedValue(updateError);

      const { updateDocumentById } = useDocumentDatabase();
      await updateDocumentById(docId, updateData);

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Erro", "Erro ao atualizar o documento.");
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error updating document:", updateError);
    });
  });

  // --- getDocumentById Tests ---
  describe("getDocumentById", () => {
    const docId = 789;
    const mockResult: Document[] = [
      { id: docId, categoria: "B", atividade: "B2", horas: 15, link: "l2", observacao: "", tipo: "" },
    ];

    it("deve chamar db.getAllSync com a query e o ID corretos", async () => {
      const { getDocumentById } = useDocumentDatabase();
      await getDocumentById(docId);

      expect(mockGetAllAsync).toHaveBeenCalledTimes(1);
      expect(mockGetAllAsync).toHaveBeenCalledWith("SELECT * FROM documento WHERE id = ?", [docId]);
    });

    it("deve retornar o resultado de db.getAllSync se encontrado", async () => {
      mockGetAllAsync.mockReturnValue(mockResult);
      const { getDocumentById } = useDocumentDatabase();
      const result = await getDocumentById(docId);

      expect(result).toEqual(mockResult);
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it("deve retornar null e chamar Alert.alert de erro se db.getAllSync retornar vazio/null", async () => {
      mockGetAllAsync.mockReturnValue([]);
      const { getDocumentById } = useDocumentDatabase();
      const result = await getDocumentById(docId);

      expect(result).toBeNull();
      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Erro", "Documento não encontrado.");
    });

    it("deve retornar null, chamar Alert.alert de erro e console.error se db.getAllSync falhar", async () => {
      const getError = new Error("DB Get Error");
      mockGetAllAsync.mockImplementation(() => {
        throw getError;
      });

      const { getDocumentById } = useDocumentDatabase();
      const result = await getDocumentById(docId);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith("Erro", "Erro ao buscar o documento.");
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting document by ID:", getError);
    });
  });
});
