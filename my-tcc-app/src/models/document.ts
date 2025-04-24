export interface Document {
  id: number;
  categoria: string;
  atividade: string;
  tipo?: string;
  horas_obtidas: number;
  observacao: string;
  link: string;
}
