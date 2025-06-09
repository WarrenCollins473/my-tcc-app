import { converterJsonParaBarema } from "../../src/utils/BaremaConversor";
import { Barema } from "../../src/models/barema";

describe("converterJsonParaBarema", () => {
  const mockJson = {
    categorias: [
      {
        nome: "Ensino",
        limite_categoria: 100,
        atividades: [
          {
            nome: "Ministrar aula",
            carga_individual: 10,
            carga_maxima: 50,
          },
          {
            nome: "Orientação",
            tipos: [
              {
                nome: "TCC",
                carga_individual: 20,
                carga_maxima: 40,
              },
            ],
          },
        ],
      },
    ],
    total_minimo: 150,
  };

  it("converte corretamente um JSON válido", () => {
    const result = converterJsonParaBarema(mockJson);

    expect(result).toEqual({
      categorias: [
        {
          nome: "Ensino",
          limite_categoria: 100,
          atividades: [
            {
              nome: "Ministrar aula",
              carga_individual: 10,
              carga_maxima: 50,
            },
            {
              nome: "Orientação",
              tipos: [
                {
                  nome: "TCC",
                  carga_individual: 20,
                  carga_maxima: 40,
                },
              ],
            },
          ],
        },
      ],
      total_minimo: 150,
    } as Barema);
  });

  it("lida com atividades sem tipos", () => {
    const jsonSemTipos = {
      categorias: [
        {
          nome: "Pesquisa",
          limite_categoria: 80,
          atividades: [
            {
              nome: "Artigo",
              carga_individual: 15,
              carga_maxima: 30,
            },
          ],
        },
      ],
      total_minimo: 100,
    };

    const result = converterJsonParaBarema(jsonSemTipos);

    expect(result.categorias[0].atividades[0]).toEqual({
      nome: "Artigo",
      carga_individual: 15,
      carga_maxima: 30,
    });
  });

  it("lida com array vazio de categorias", () => {
    const result = converterJsonParaBarema({ categorias: [], total_minimo: 0 });

    expect(result).toEqual({
      categorias: [],
      total_minimo: 0,
    });
  });

  it("preserva todos os campos obrigatórios", () => {
    const result = converterJsonParaBarema(mockJson);

    result.categorias.forEach(categoria => {
      expect(categoria).toHaveProperty("nome");
      expect(categoria).toHaveProperty("limite_categoria");
      expect(categoria).toHaveProperty("atividades");

      categoria.atividades.forEach(atividade => {
        expect(atividade).toHaveProperty("nome");
        if (!atividade.tipos) {
          expect(atividade).toHaveProperty("carga_individual");
          expect(atividade).toHaveProperty("carga_maxima");
        }
      });
    });
  });

  it("lança erro para JSON inválido", () => {
    expect(() => converterJsonParaBarema(null as any)).toThrow();
    expect(() => converterJsonParaBarema(undefined as any)).toThrow();
  });

  it("lida com atividades com tipos vazios", () => {
    const jsonComTiposVazios = {
      categorias: [
        {
          nome: "Extensão",
          limite_categoria: 50,
          atividades: [
            {
              nome: "Evento",
              tipos: [],
            },
          ],
        },
      ],
      total_minimo: 50,
    };

    const result = converterJsonParaBarema(jsonComTiposVazios);

    expect(result.categorias[0].atividades[0]).toEqual({
      nome: "Evento",
      tipos: [],
    });
  });
});
