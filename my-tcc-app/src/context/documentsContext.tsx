import React, { createContext, useContext, useState, ReactNode } from "react";
import { Document, horasPorCategoria } from "../models/document";
import { useDocumentDatabase } from "../service/useDocumentDatabase";
import { Barema } from "../models/barema";
import { converterJsonParaBarema } from "../utils/BaremaConversor";
import * as baremaJson from "./../../assets/barema.json";
import { getTotalHours, getTotalHoursbyCategory } from "../utils/HoursCalculator";

type DocumentsContextType = {
  hourByCategory?: horasPorCategoria[];
  documents?: Document[];
  hourTotal?: number;
  barema?: Barema;
  hourMin?: number;
  loading: boolean;
  getBarema: () => void;
  getDocumentsList: () => void;
  updateDocument: (document: Document) => void;
  createDocument: (Document: Omit<Document, "id">) => void;
  deleteDocument: (documentId: number) => void;
};

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const DocumentsProvider = ({ children }: Props) => {
  const [barema, setBarema] = useState<Barema>();
  const [documents, setDocuments] = useState<Document[]>();
  const [hourByCategory, setHourByCategory] = useState<horasPorCategoria[]>();
  const [hourTotal, setHourTotal] = useState<number>();
  const [hourMin, setHourMin] = useState<number>();
  const [loading, setLoading] = useState(true);
  const { readAll, deleteDocumentById, insert, updateDocumentById } = useDocumentDatabase();

  const getDocumentsList = async () => {
    const barema = getBarema();
    const documents = await readAll();
    setDocuments(documents);
    setHorasPorCategoria(barema, documents);
    setHorasTotal(barema, documents);
    setLoading(false);
  };

  const updateDocument = async (document: Document) => {
    await updateDocumentById(document.id, {
      categoria: document.categoria,
      atividade: document.atividade,
      tipo: document.tipo,
      observacao: document.observacao,
      link: document.link,
      horas: document.horas,
    }).then(() => {
      getDocumentsList();
    });
  };

  const createDocument = async (Document: Omit<Document, "id">) => {
    await insert(Document).then(() => {
      getDocumentsList();
    });
  };

  const deleteDocument = async (documentId: number) => {
    await deleteDocumentById(documentId).then(() => {
      getDocumentsList();
    });
  };

  const setHorasPorCategoria = (barema: Barema, documents: Document[]) => {
    const categorias = barema.categorias.map(categoria => {
      const totalHoras = getTotalHoursbyCategory(categoria.nome, documents);
      return {
        categoria: categoria.nome,
        horas: totalHoras,
        maxHoras: categoria.limite_categoria,
      };
    });
    setHourByCategory(categorias);
  };
  const setHorasTotal = (barema: Barema, documents: Document[]) => {
    const total = getTotalHours(barema, documents);
    setHourTotal(total);
    setHourMin(barema.total_minimo);
  };

  const getBarema = () => {
    const barema = converterJsonParaBarema(baremaJson);
    setBarema(barema);
    return barema;
  };

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        hourByCategory,
        hourTotal,
        barema,
        loading,
        hourMin,
        getBarema,
        getDocumentsList,
        updateDocument,
        createDocument,
        deleteDocument,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error("useDocuments deve ser usado dentro de um DocumentsProvider");
  }
  return context;
};
