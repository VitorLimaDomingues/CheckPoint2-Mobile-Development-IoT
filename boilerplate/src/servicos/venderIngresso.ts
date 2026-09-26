import { Sala, PedidoVenda, Sessao, Venda, ResultadoVenda, Classificacao} from '../tipos';
import { precoDoIngresso } from './precoDoIngresso'
import { poltronaValida } from './poltronaValida'
import { listarSessoes } from './listarSessoes'

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

export function venderIngresso(pedido: PedidoVenda, sessoes: Sessao[], vendas: Venda[]): ResultadoVenda {
  const sessaoEncontrada: Sessao | undefined = sessoes.find((sessao: Sessao): boolean => sessao.id === pedido.sessaoId)
  const idadeMinimaPorClassificacao: Record<Classificacao, number> = {
    LIVRE: 0,
    DEZ: 10,
    DOZE: 12,
    QUATORZE: 14,
    DEZOITO: 18
  };
  
  if (sessaoEncontrada === undefined) {
    return {
      tipo: 'RECUSADO',
      motivo: 'sessao nao encontrada'
    }
  } else if (sessaoEncontrada.cancelada === true) {
    return {
      tipo: 'RECUSADO',
      motivo: 'sessao cancelada'
    } 
  } else if (!poltronaValida(pedido.poltrona, sessaoEncontrada.capacidade)) {
    return {
      tipo: "RECUSADO",
      motivo: "poltrona invalida"
    }
  } else if (
    vendas.some(
      (venda: Venda): boolean =>
        venda.sessaoId === pedido.sessaoId &&
        venda.poltrona.trim().toUpperCase() === pedido.poltrona.trim().toUpperCase()
    )
    ) {
    return {
      tipo: 'RECUSADO',
      motivo: 'poltrona ocupada'
    };
  } else if (pedido.idade < idadeMinimaPorClassificacao[sessaoEncontrada.filme.classificacao])  {
    return {
      tipo: 'RECUSADO',
      motivo: 'idade abaixo da classificacao'
    } 
  } else {
    const precoBase: number = precoBaseDaSala(sessaoEncontrada.sala);
    const meiaEntrada: boolean = pedido.tipo !== 'INTEIRA';
    const precoFinal: number = precoDoIngresso(
      precoBase,
      meiaEntrada,
      sessaoEncontrada.horario
    );

    return {
      tipo: 'VENDIDO',
      venda: {
        sessaoId: sessaoEncontrada.id,
        poltrona: pedido.poltrona.trim().toUpperCase(),
        preco: precoFinal,
        tipo: pedido.tipo
      }
    };
  } 
}