import { Sala } from '../tipos';

/**
 * Q4 — POST /vendas
 *
 * O coracao do checkpoint, e o lugar onde as suas Q1 e Q2 viram pecas:
 *
 *   import { precoDoIngresso } from './precoDoIngresso';
 *   import { poltronaValida } from './poltronaValida';
 *
 * Antes da funcao, escreva Venda e ResultadoVenda no src/tipos.ts.
 * A rota POST /vendas em src/api/rotas.ts le o seu ResultadoVenda campo
 * a campo: ela e a especificacao do tipo.
 *
 * A funcao inteira e com voce:
 *
 *   - o nome precisa ser exatamente venderIngresso, exportada;
 *   - COMO ela e chamada esta em tests/venderIngresso.test.ts;
 *   - a ordem das recusas e os textos exatos estao no ENUNCIADO.pdf;
 *   - meia-entrada e todo tipo que nao for 'INTEIRA', e o preco final
 *     vem da sua Q1 com o horario da sessao.
 *
 * O helper ai embaixo entrega o preco base da sala, para a tabela nao
 * virar obstaculo.
 */

/** O preco base de cada sala: precoBaseDaSala(Sala.IMAX) devolve 45. */
export function precoBaseDaSala(sala: Sala): number {
  switch (sala) {
    case Sala.PADRAO:
      return 30;
    case Sala.IMAX:
      return 45;
    case Sala.VIP:
      return 60;
    default:
      return 30;
  }
}

// TODO: export function venderIngresso(...) { ... }
