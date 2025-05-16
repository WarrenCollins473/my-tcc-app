import { Barema } from "../models/barema";
import { Document } from "../models/document";

export const getTotalHoursbyCategory = (categoria: string, documents: Document[]) => {
  let total = 0;
  documents?.forEach(document => {
    if (document.categoria === categoria) {
      total += document.horas;
    }
  });
  return total;
};

export const getTotalHours = (barema: Barema, documents: Document[]) => {
  let total = 0;
  barema?.categorias.forEach(categoria => {
    let totalCategoria = getTotalHoursbyCategory(categoria.nome, documents);
    if (totalCategoria > categoria.limite_categoria) {
      total += categoria.limite_categoria;
    } else {
      total += totalCategoria;
    }
  });
  return total;
};
