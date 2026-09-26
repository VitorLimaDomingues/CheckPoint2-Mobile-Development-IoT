/**
 * ajuda.ts — dois atalhos que os testes usam para ler o ResultadoVenda.
 *
 * JA VEM PRONTO. Leia: eles mostram como quem recebe o seu resultado e
 * obrigado a olhar o campo `tipo` antes de acessar o resto.
 */
import { ResultadoVenda, Venda } from '../src/tipos';

export function vendaDe(resultado: ResultadoVenda): Venda {
  if (resultado.tipo !== 'VENDIDO') {
    throw new Error('esperava VENDIDO e veio ' + JSON.stringify(resultado));
  }

  return resultado.venda;
}

export function motivoDe(resultado: ResultadoVenda): string {
  if (resultado.tipo !== 'RECUSADO') {
    throw new Error('esperava RECUSADO e veio ' + JSON.stringify(resultado));
  }

  return resultado.motivo;
}
