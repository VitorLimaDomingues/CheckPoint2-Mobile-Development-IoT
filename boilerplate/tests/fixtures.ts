/**
 * fixtures.ts — os dados que os testes usam.
 *
 * JA VEM PRONTO. Sao as mesmas cinco sessoes do repositorio.
 * Se voce quiser inventar seus proprios testes, importe daqui.
 */
import { Classificacao, Filme, Formato, Sala, Sessao, Venda } from '../src/tipos';

function filme(
  id: string,
  titulo: string,
  duracaoMin: number,
  classificacao: Classificacao,
  generos: string[]
): Filme {
  return { id, titulo, duracaoMin, classificacao, generos };
}

export const DUNA: Filme = filme('1', 'Duna', 155, 'QUATORZE', ['Ficção', 'Aventura']);
export const CORINGA: Filme = filme('2', 'Coringa', 122, 'DEZOITO', ['Drama', 'Suspense']);
export const BICHOS: Filme = filme('3', 'Meu Malvado Favorito', 95, 'LIVRE', ['Animação', 'Comédia']);
export const MATRIX: Filme = filme('4', 'Matrix', 136, 'QUATORZE', ['Ficção', 'Ação']);

export const SESSOES: Sessao[] = [
  { id: '1', filme: DUNA, sala: Sala.IMAX, formato: Formato.LEGENDADO,
    horario: '14:00', capacidade: 60, cancelada: false },
  { id: '2', filme: BICHOS, sala: Sala.PADRAO, formato: Formato.DUBLADO,
    horario: '15:30', capacidade: 40, cancelada: false },
  { id: '3', filme: CORINGA, sala: Sala.VIP, formato: Formato.LEGENDADO,
    horario: '19:30', capacidade: 20, cancelada: false },
  { id: '4', filme: MATRIX, sala: Sala.IMAX, formato: Formato.ORIGINAL,
    horario: '21:00', capacidade: 60, cancelada: false },
  { id: '5', filme: DUNA, sala: Sala.PADRAO, formato: Formato.DUBLADO,
    horario: '22:30', capacidade: 40, cancelada: true },
];

/** Uma sala pequena, para os testes que precisam lotar a sessao. */
export const SALA_PEQUENA: Sessao = {
  id: '99', filme: BICHOS, sala: Sala.PADRAO, formato: Formato.DUBLADO,
  horario: '10:00', capacidade: 10, cancelada: false,
};

/** Atalho para escrever uma venda em uma linha. */
export function venda(sessaoId: string, poltrona: string, preco: number): Venda {
  return { sessaoId, poltrona, preco, tipo: 'INTEIRA' };
}
