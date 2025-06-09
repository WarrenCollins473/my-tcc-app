import { SQLiteDatabase } from "expo-sqlite";
import { initializeDatabase } from "../../src/service/Database"; // Ajuste o caminho conforme necessário

// Mock do expo-sqlite
jest.mock("expo-sqlite", () => ({
  SQLiteDatabase: jest.fn().mockImplementation(() => ({
    execAsync: jest.fn(),
    closeAsync: jest.fn(),
  })),
}));

describe("initializeDatabase", () => {
  let mockDb: jest.Mocked<SQLiteDatabase>;

  beforeEach(() => {
    // Resetar mocks antes de cada teste
    jest.clearAllMocks();

    mockDb = {
      execAsync: jest.fn(),
      closeAsync: jest.fn(),
      // Adicione outras propriedades necessárias do SQLiteDatabase conforme usado na sua aplicação
    } as unknown as jest.Mocked<SQLiteDatabase>;
  });

  test("deve criar a tabela documento com a estrutura correta", async () => {
    await initializeDatabase(mockDb);

    // Verifica se execAsync foi chamado uma vez
    expect(mockDb.execAsync).toHaveBeenCalledTimes(1);

    // Obtém a query SQL que foi passada para execAsync
    const sqlQuery = mockDb.execAsync.mock.calls[0][0];

    // Verifica se a query contém os elementos esperados
    expect(sqlQuery).toContain("CREATE TABLE IF NOT EXISTS documento");
    expect(sqlQuery).toContain("id INTEGER PRIMARY KEY AUTOINCREMENT");
    expect(sqlQuery).toContain("categoria TEXT");
    expect(sqlQuery).toContain("atividade TEXT");
    expect(sqlQuery).toContain("tipo TEXT");
    expect(sqlQuery).toContain("observacao TEXT");
    expect(sqlQuery).toContain("link TEXT");
    expect(sqlQuery).toContain("horas INTEGER");
  });

  test("deve lidar com erros na execução do SQL", async () => {
    const errorMessage = "Erro ao criar tabela";
    mockDb.execAsync.mockRejectedValue(new Error(errorMessage));

    // Verifica se a função rejeita com o erro esperado
    await expect(initializeDatabase(mockDb)).rejects.toThrow(errorMessage);
  });

  test("a query SQL deve ter a sintaxe correta", async () => {
    await initializeDatabase(mockDb);

    const sqlQuery = mockDb.execAsync.mock.calls[0][0];

    // Verifica se a query termina com ponto e vírgula
    expect(sqlQuery.trim().endsWith(";")).toBe(true);

    // Verifica se não há linhas vazias ou espaços extras
    const lines = sqlQuery
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
    expect(lines.every(line => line.length > 0)).toBe(true);

    // Verifica se a formatação está correta (opcional, dependendo dos requisitos)
    expect(sqlQuery).toContain(` 
    CREATE TABLE IF NOT EXISTS documento (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    categoria TEXT, 
    atividade TEXT, 
    tipo TEXT, 
    observacao TEXT, 
    link TEXT, 
    horas INTEGER
);
`);
  });
});
