import { Barema, Categoria } from "../models/barema";

export function converterJsonParaBarema(jsonData: any): Barema {
  return {
    categorias: jsonData.categorias.map((categoria: any) => ({
      nome: categoria.nome,
      limite_categoria: categoria.limite_categoria,
      atividades: categoria.atividades.map((atividade: any) => {
        const base = { nome: atividade.nome };
        return atividade.tipos
          ? {
              ...base,
              tipos: atividade.tipos.map((t: any) => ({
                nome: t.nome,
                carga_individual: t.carga_individual,
                carga_maxima: t.carga_maxima,
              })),
            }
          : {
              ...base,
              carga_individual: atividade.carga_individual,
              carga_maxima: atividade.carga_maxima,
            };
      }),
    })),
    total_minimo: jsonData.total_minimo,
  };
}
