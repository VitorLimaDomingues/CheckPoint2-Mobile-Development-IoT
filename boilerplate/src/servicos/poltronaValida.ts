/**
 * Q2 — GET /poltrona-valida
 *
 * A funcao inteira e com voce, da assinatura ao return:
 *
 *   - o nome precisa ser exatamente poltronaValida, exportada;
 *   - COMO ela e chamada esta em tests/poltronaValida.test.ts;
 *   - as regras (limpeza, letra da fileira, numero de 1 a 10) estao no
 *     ENUNCIADO.pdf, com a tabela de capacidade por fileira.
 *
 * As nativas que resolvem: trim, toUpperCase, charAt, substring, Number.
 * O helper ai embaixo tira da frente a conta de quantas fileiras a sala tem.
 */

const FILEIRAS: string = 'ABCDEFGHIJ';

/** As fileiras que existem numa sala: fileirasDaSala(30) devolve 'ABC'. */
export function fileirasDaSala(capacidade: number): string {
  return FILEIRAS.substring(0, capacidade / 10);
}

// TODO: export function poltronaValida(...) { ... }
