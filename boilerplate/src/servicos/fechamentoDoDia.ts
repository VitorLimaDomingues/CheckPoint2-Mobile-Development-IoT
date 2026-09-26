/**
 * Q5 — GET /fechamento
 *
 * O desafio. Antes da funcao, escreva o Fechamento no src/tipos.ts.
 *
 * A funcao inteira e com voce:
 *
 *   - o nome precisa ser exatamente fechamentoDoDia, exportada;
 *   - COMO ela e chamada esta em tests/fechamentoDoDia.test.ts;
 *   - as regras (ocupacao por sala, sessao cancelada fora de tudo,
 *     empate, dia sem venda) estao no ENUNCIADO.pdf.
 */

import { Fechamento, Sessao, Venda } from '../tipos';

/** Arredonda para duas casas, para a receita nao sair com 0.30000000004. */
export function arredondar2(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// TODO: export function fechamentoDoDia(...) { ... }

export function fechamentoDoDia(sessoes: Sessao[], vendas: Venda[]): Fechamento {
  const sessoesValidas: Sessao[] = sessoes.filter(
    (sessao: Sessao): boolean => !sessao.cancelada
  );

  const vendasValidas: Venda[] = vendas.filter(
    (venda: Venda): boolean =>
      sessoesValidas.some(
        (sessao: Sessao): boolean => sessao.id === venda.sessaoId
      )
  );

  const ingressos: number = vendasValidas.length;
  const receita: number = arredondar2(
    vendasValidas.reduce(
      (total: number, venda: Venda): number => total + venda.preco,
      0
    )
  );

  const capacidadePorSala: Record<string, number> = {};
  const vendidosPorSala: Record<string, number> = {};
  let sessaoMaisCheia: string | null = null;
  let maiorQuantidadeVendida: number = 0;

  sessoesValidas.forEach((sessao: Sessao): void => {
    const vendidosNaSessao: number = vendasValidas.filter(
      (venda: Venda): boolean => venda.sessaoId === sessao.id
    ).length;

    capacidadePorSala[sessao.sala] =
      (capacidadePorSala[sessao.sala] || 0) + sessao.capacidade;
    vendidosPorSala[sessao.sala] =
      (vendidosPorSala[sessao.sala] || 0) + vendidosNaSessao;

    if (vendidosNaSessao > maiorQuantidadeVendida) {
      maiorQuantidadeVendida = vendidosNaSessao;
      sessaoMaisCheia = sessao.id;
    }
  });

  const ocupacaoPorSala: Record<string, number> = {};

  Object.keys(capacidadePorSala).forEach((sala: string): void => {
    ocupacaoPorSala[sala] = Math.round(
      ((vendidosPorSala[sala] || 0) / capacidadePorSala[sala]) * 100
    );
  });

  return {
    ingressos,
    receita,
    ocupacaoPorSala,
    sessaoMaisCheia
  };
}
