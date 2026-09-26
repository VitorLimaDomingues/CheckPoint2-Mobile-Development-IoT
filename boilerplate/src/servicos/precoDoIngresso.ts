/**
 * Q1 — GET /preco
 *
 * A funcao inteira e com voce, da assinatura ao return:
 *
 *   - o nome precisa ser exatamente precoDoIngresso, exportada;
 *   - COMO ela e chamada, o que entra e o que sai, esta em
 *     tests/precoDoIngresso.test.ts: abra e leia antes de escrever;
 *   - as regras (meia, acrescimo noturno, arredondamento) estao no
 *     ENUNCIADO.pdf, com exemplos de entrada e saida.
 *
 * Os helpers ai embaixo ja estao prontos para o trabalho bracal.
 * Use se quiser, e repare como cada um e tipado.
 */

/** Pega a hora de um texto 'HH:MM': horaDoHorario('21:30') devolve 21. */
export function horaDoHorario(horario: string): number {
  return Number(horario.substring(0, 2));
}

/** Arredonda para duas casas: arredondar2(24.7499) devolve 24.75. */
export function arredondar2(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// TODO: export function precoDoIngresso(...) { ... }
