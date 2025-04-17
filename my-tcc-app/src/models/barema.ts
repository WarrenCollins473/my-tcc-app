export interface TipoAtividade {
    nome: string;
    carga_individual: number;
    carga_maxima: number;
  }
  
export interface Atividade {
    nome: string;
    carga_individual?: number;
    carga_maxima?: number;
    tipos?: TipoAtividade[];
  }
  
export interface Categoria {
    nome: string;
    limite_categoria: number;  // Limite máximo da categoria
    atividades: Atividade[];
  }
  
export interface Barema {
    categorias: Categoria[];
    total_minimo: number;
  }
  
  