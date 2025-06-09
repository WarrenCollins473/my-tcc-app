// __mocks__/baremaMock.js
export const mockBarema = {
  categorias: [
    {
      nome: "Categoria A",
      atividades: [
        {
          nome: "Atividade 1A",
          carga_individual: 10,
          carga_maxima: 50,
          tipos: [
            {
              nome: "Tipo 1A.1",
              carga_individual: 5,
              carga_maxima: 20,
            },
            {
              nome: "Tipo 1A.2",
              carga_individual: 15,
              carga_maxima: 60,
            },
          ],
          limite_horas: 100,
        },
        {
          nome: "Atividade 2A",
          carga_individual: 20,
          carga_maxima: 100,
        },
      ],
    },
    {
      nome: "Categoria B",
      atividades: [
        {
          nome: "Atividade 1B",
          carga_individual: 5,
          carga_maxima: 30,
        },
      ],
      limite_horas: 100,
    },
  ],
  total_minimo: 100,
};

// __mocks__/documentMock.js
export const mockDocument = {
  id: 1,
  categoria: "Categoria A",
  atividade: "Atividade 1A",
  tipo: "Tipo 1A.1",
  observacao: "Obs do documento",
  link: "http://link.com",
  horas: 10,
};

export const mockDocumentNoType = {
  id: 2,
  categoria: "Categoria A",
  atividade: "Atividade 2A",
  tipo: undefined, // Simula um documento sem tipo, como em Atividade 2A
  observacao: "Obs sem tipo",
  link: "http://link2.com",
  horas: 25,
};
