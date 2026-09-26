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

export function poltronaValida(poltrona: string, capacidade: number): boolean {
  const assentoLimpo: string = poltrona.trim().toUpperCase();
  const fileira: string = assentoLimpo.charAt(0);
  const numeroTexto: string = assentoLimpo.substring(1);
  const numero: number = Number(numeroTexto);
  const fileirasExistentes: string = fileirasDaSala(capacidade);
  const fileiraValida: boolean = fileirasExistentes.includes(fileira);

  const numeroValido: boolean = Number.isInteger(numero) && numero >= 1 && numero <= 10;

  return fileiraValida && numeroValido;
}