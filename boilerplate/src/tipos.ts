/**
 * tipos.ts — os contratos do Cine FIAP.
 *
 * A PRIMEIRA PARTE ja vem pronta: sao os mesmos tipos do Checkpoint 1.
 * Nao precisa mexer neles.
 *
 * A SEGUNDA PARTE e sua. Sao quatro declaracoes novas, e elas nascem
 * de uma pergunta so: o que cada servico precisa receber e devolver?
 *
 * Dica: escreva o tipo ANTES do servico. O editor passa a completar os
 * campos, e o erro aparece enquanto voce digita, nao no teste.
 */

// ═══════════════════════════════════════════════════════════════════
//  JA VEM PRONTO — os tipos do Checkpoint 1
// ═══════════════════════════════════════════════════════════════════

export enum Sala {
  PADRAO = 'PADRAO',
  VIP = 'VIP',
  IMAX = 'IMAX',
}

export enum Formato {
  DUBLADO = 'DUBLADO',
  LEGENDADO = 'LEGENDADO',
  ORIGINAL = 'ORIGINAL',
}

export type Classificacao = 'LIVRE' | 'DEZ' | 'DOZE' | 'QUATORZE' | 'DEZOITO';

export type StatusSessao = 'ABERTA' | 'ESGOTADA' | 'ENCERRADA';

export interface Filme {
  id: string;
  titulo: string;
  duracaoMin: number;
  classificacao: Classificacao;
  generos: string[];
}

export interface Sessao {
  id: string;
  filme: Filme;
  sala: Sala;
  formato: Formato;
  horario: string;
  capacidade: number;
  cancelada: boolean;
}

/** Tipo de ingresso. Meia-entrada e metade do preco. */
export type TipoIngresso = 'INTEIRA' | 'ESTUDANTE' | 'IDOSO' | 'CRIANCA';

/** O que a rota POST /vendas entrega para o seu servico. */
export interface PedidoVenda {
  sessaoId: string;
  poltrona: string;
  idade: number;
  tipo: TipoIngresso;
}

// ═══════════════════════════════════════════════════════════════════
//  AGORA E COM VOCE — um tipo nasce junto com a questao que o usa
// ═══════════════════════════════════════════════════════════════════

// TODO (Q3): export interface SessaoResumo
//   O que a rota GET /sessoes devolve para cada sessao.

export interface SessaoResumo {
  id: string,
  titulo: string,
  horario: string,
  sala: Sala,
  formato: Formato,
  vendidos: number,
  capacidade: number,
  status: StatusSessao
}

// TODO (Q4): export interface Venda
//   Um ingresso ja vendido. Precisa saber de qual sessao e, qual poltrona
//   ocupa, quanto custou e que tipo de ingresso foi.

export interface Venda {
  sessaoId: string,
  poltrona: string,
  preco: number,
  tipo: TipoIngresso
}

// TODO (Q4): export type ResultadoVenda
//   Uma venda ou da certo ou nao da. Modele as DUAS possibilidades num
//   tipo so, de um jeito que quem recebe seja obrigado a tratar as duas.
//   src/api/rotas.ts mostra exatamente como a rota le este tipo.

export type ResultadoVenda = | {
  tipo: 'VENDIDO';
  venda: Venda;
} | {
  tipo: "RECUSADO";
  motivo: string;
} 

// TODO (Q5): export interface Fechamento
//   O que a rota GET /fechamento devolve no fim do dia.

export interface Fechamento {
  ingressos: number;
  receita: number;
  ocupacaoPorSala: Record<string, number>;
  sessaoMaisCheia: string | null;
}
