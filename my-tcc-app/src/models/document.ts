export interface Document {
  id: number;
  categoria: string;
  atividade: string;
  tipo?: string;
  horas: number;
  observacao: string;
  link: string;
}

export interface horasPorCategoria {
  categoria: string;
  horas: number;
  maxHoras: number;
}
