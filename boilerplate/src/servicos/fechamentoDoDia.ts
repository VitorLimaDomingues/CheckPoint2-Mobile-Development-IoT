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

/** Arredonda para duas casas, para a receita nao sair com 0.30000000004. */
export function arredondar2(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// TODO: export function fechamentoDoDia(...) { ... }
