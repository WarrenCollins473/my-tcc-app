import { getTotalHoursbyCategory, getTotalHours } from "../../src/utils/HoursCalculator";
import { Barema, Categoria } from "../../src/models/barema";
import { Document } from "../../src/models/document";

describe("HoursCalculator", () => {
  const mockDocuments: Document[] = [
    {
      id: 1,
      categoria: "Ensino",
      horas: 30,
      atividade: "",
      observacao: "",
      link: "",
    },
    {
      id: 2,
      categoria: "Ensino",
      horas: 20,
      atividade: "",
      observacao: "",
      link: "",
    },
    {
      id: 3,
      categoria: "Pesquisa",
      horas: 40,
      atividade: "",
      observacao: "",
      link: "",
    },
    {
      id: 4,
      categoria: "Extensão",
      horas: 10,
      atividade: "",
      observacao: "",
      link: "",
    },
  ];

  const mockBarema: Barema = {
    categorias: [
      { nome: "Ensino", limite_categoria: 100, atividades: [] },
      { nome: "Pesquisa", limite_categoria: 80, atividades: [] },
      { nome: "Extensão", limite_categoria: 50, atividades: [] },
    ],
    total_minimo: 150,
  };

  describe("getTotalHoursbyCategory", () => {
    it("calcula corretamente horas por categoria", () => {
      expect(getTotalHoursbyCategory("Ensino", mockDocuments)).toBe(50);
      expect(getTotalHoursbyCategory("Pesquisa", mockDocuments)).toBe(40);
      expect(getTotalHoursbyCategory("Extensão", mockDocuments)).toBe(10);
    });

    it("retorna 0 para categoria sem documentos", () => {
      expect(getTotalHoursbyCategory("Inexistente", mockDocuments)).toBe(0);
    });

    it("retorna 0 para lista vazia de documentos", () => {
      expect(getTotalHoursbyCategory("Ensino", [])).toBe(0);
    });

    it("ignora documentos sem categoria correspondente", () => {
      const docs = [
        ...mockDocuments,
        { id: 5, categoria: "Outra", horas: 100, atividade: "", observacao: "", link: "" },
      ];
      expect(getTotalHoursbyCategory("Ensino", docs)).toBe(50);
    });
  });

  describe("getTotalHours", () => {
    it("calcula o total respeitando os limites por categoria", () => {
      // Ensino: 50 (dentro do limite 100)
      // Pesquisa: 40 (dentro do limite 80)
      // Extensão: 10 (dentro do limite 50)
      expect(getTotalHours(mockBarema, mockDocuments)).toBe(50 + 40 + 10);
    });

    it("aplica limite quando horas excedem o máximo da categoria", () => {
      const docsExcedendoLimite = [
        ...mockDocuments,
        { id: 5, categoria: "Ensino", horas: 60, atividade: "", observacao: "", link: "" }, // Total Ensino = 110 (limite 100)
      ];
      expect(getTotalHours(mockBarema, docsExcedendoLimite)).toBe(100 + 40 + 10);
    });

    it("funciona corretamente quando todas categorias excedem limite", () => {
      const docs = [
        { id: 1, categoria: "Ensino", horas: 120, atividade: "", observacao: "", link: "" },
        { id: 2, categoria: "Pesquisa", horas: 90, atividade: "", observacao: "", link: "" },
      ];
      expect(getTotalHours(mockBarema, docs)).toBe(100 + 80);
    });

    it("retorna 0 para lista vazia de documentos", () => {
      expect(getTotalHours(mockBarema, [])).toBe(0);
    });

    it("retorna 0 para barema sem categorias", () => {
      expect(getTotalHours({ categorias: [], total_minimo: 0 }, mockDocuments)).toBe(0);
    });

    it("ignora documentos de categorias não listadas no barema", () => {
      const docs = [
        ...mockDocuments,
        { id: 5, categoria: "Outra", horas: 100, atividade: "", observacao: "", link: "" },
      ];
      expect(getTotalHours(mockBarema, docs)).toBe(50 + 40 + 10);
    });
  });
});
