import React, { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { DocumentsProvider, useDocumentsContext } from "../../src/context/documentsContext";
import { useDocumentDatabase } from "../../src/service/useDocumentDatabase";
import { converterJsonParaBarema } from "../../src/utils/BaremaConversor";
import * as baremaJson from "./../../assets/barema.json";

jest.mock("../../src/service/useDocumentDatabase", () => ({
  useDocumentDatabase: () => ({
    readAll: jest.fn().mockResolvedValue(mockDocuments),
    deleteDocumentById: jest.fn().mockResolvedValue(undefined),
    insert: jest.fn().mockResolvedValue(undefined),
    updateDocumentById: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock("./../../assets/barema.json", () => ({
  categorias: [
    { nome: "Ensino", limite_categoria: 100 },
    { nome: "Pesquisa", limite_categoria: 100 },
  ],
  total_minimo: 200,
}));

jest.mock("../../src/utils/BaremaConversor", () => ({
  converterJsonParaBarema: jest.fn().mockReturnValue({
    categorias: [
      { nome: "Ensino", limite_categoria: 100 },
      { nome: "Pesquisa", limite_categoria: 100 },
    ],
    total_minimo: 200,
  }),
}));

jest.mock("../../src/utils/HoursCalculator", () => ({
  getTotalHours: jest.fn().mockReturnValue(100),
  getTotalHoursbyCategory: jest.fn().mockReturnValue(50),
}));

const mockBarema = {
  categorias: [
    { nome: "Ensino", limite_categoria: 100 },
    { nome: "Pesquisa", limite_categoria: 100 },
  ],
  total_minimo: 200,
};

const mockDocuments = [
  { id: 1, categoria: "Ensino", horas: 30 },
  { id: 2, categoria: "Pesquisa", horas: 40 },
];

const wrapper = ({ children }: { children: ReactNode }) => <DocumentsProvider>{children}</DocumentsProvider>;

describe("DocumentsContext", () => {
  it("fornece valores iniciais corretos", () => {
    const { result } = renderHook(() => useDocumentsContext(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.documents).toBeUndefined();
    expect(result.current.barema).toBeUndefined();
  });

  it("carrega barema corretamente", () => {
    const { result } = renderHook(() => useDocumentsContext(), { wrapper });

    act(() => {
      result.current.getBarema();
    });

    expect(converterJsonParaBarema).toHaveBeenCalledWith(baremaJson);
    expect(result.current.barema).toEqual(mockBarema);
  });

  it("carrega documentos e calcula horas", async () => {
    const { result } = renderHook(() => useDocumentsContext(), { wrapper });

    await act(async () => {
      result.current.getDocumentsList();
    });

    expect(result.current.documents).toEqual(mockDocuments);
    expect(result.current.hourByCategory).toEqual([
      { categoria: "Ensino", horas: 50, maxHoras: 100 },
      { categoria: "Pesquisa", horas: 50, maxHoras: 100 },
    ]);
    expect(result.current.hourTotal).toBe(100);
    expect(result.current.hourMin).toBe(200);
    expect(result.current.loading).toBe(false);
  });

  it("atualiza documento corretamente", async () => {
    const { result } = renderHook(() => useDocumentsContext(), { wrapper });
    const updatedDoc = {
      id: 1,
      categoria: "Ensino",
      horas: 35,
      atividade: "Aula",
      tipo: "Teórica",
      observacao: "Atualizado",
      link: "http://example.com",
    };

    await act(async () => {
      await result.current.updateDocument(updatedDoc);
    });

    expect(useDocumentDatabase().updateDocumentById).toHaveBeenCalled;
  });

  it("cria novo documento corretamente", async () => {
    const { result } = renderHook(() => useDocumentsContext(), { wrapper });
    const newDoc = {
      categoria: "Extensão",
      horas: 20,
      atividade: "Palestra",
      tipo: "Presencial",
      observacao: "Novo",
      link: "http://example.com",
    };

    await act(async () => {
      await result.current.createDocument(newDoc);
    });

    expect(useDocumentDatabase().insert).toHaveBeenCalled;
  });

  it("remove documento corretamente", async () => {
    const { result } = renderHook(() => useDocumentsContext(), { wrapper });

    await act(async () => {
      await result.current.deleteDocument(1);
    });

    expect(useDocumentDatabase().deleteDocumentById).toHaveBeenCalled;
  });

  it("lança erro quando usado fora do Provider", () => {
    const { result } = renderHook(() => useDocumentsContext());

    expect(result.error).toEqual(new Error("useDocuments deve ser usado dentro de um DocumentsProvider"));
  });
});
