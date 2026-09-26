import { fechamentoDoDia } from '../src/servicos/fechamentoDoDia';
import { SESSOES, venda } from './fixtures';

describe('fechamentoDoDia', () => {
  it('dia sem venda nenhuma', () => {
    const fim = fechamentoDoDia(SESSOES, []);
    expect(fim.ingressos).toBe(0);
    expect(fim.receita).toBe(0);
    expect(fim.sessaoMaisCheia).toBeNull();
  });

  it('conta os ingressos vendidos', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('1', 'A1', 45), venda('2', 'A1', 30)]);
    expect(fim.ingressos).toBe(2);
  });

  it('soma a receita', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('1', 'A1', 45), venda('3', 'A1', 66)]);
    expect(fim.receita).toBe(111);
  });

  it('soma centavos sem sobra de ponto flutuante', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('4', 'A1', 24.75), venda('4', 'A2', 24.75)]);
    expect(fim.receita).toBe(49.5);
  });

  it('ignora venda de sessao cancelada', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('1', 'A1', 45), venda('5', 'A1', 30)]);
    expect(fim.ingressos).toBe(1);
    expect(fim.receita).toBe(45);
  });

  it('lista uma sala para cada sala que teve sessao valida', () => {
    const fim = fechamentoDoDia(SESSOES, []);
    expect(Object.keys(fim.ocupacaoPorSala).sort()).toEqual(['IMAX', 'PADRAO', 'VIP']);
  });

  it('ocupacao e a porcentagem inteira da sala inteira', () => {
    const dez = [];
    for (let i = 1; i <= 10; i += 1) {
      dez.push(venda('3', 'A' + i, 66));
    }
    const fim = fechamentoDoDia(SESSOES, dez);
    expect(fim.ocupacaoPorSala.VIP).toBe(50);
  });

  it('soma as duas sessoes da mesma sala na mesma conta', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('1', 'A1', 45), venda('4', 'A1', 49.5)]);
    expect(fim.ocupacaoPorSala.IMAX).toBe(2);
  });

  it('a sala da sessao cancelada nao ganha a capacidade dela', () => {
    const vinte = [];
    for (let i = 1; i <= 20; i += 1) {
      vinte.push(venda('2', 'A' + i, 30));
    }
    const fim = fechamentoDoDia(SESSOES, vinte);
    expect(fim.ocupacaoPorSala.PADRAO).toBe(50);
  });

  it('sala sem venda fica com zero', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('1', 'A1', 45)]);
    expect(fim.ocupacaoPorSala.VIP).toBe(0);
  });

  it('aponta a sessao com mais ingressos', () => {
    const vendas = [venda('1', 'A1', 45), venda('3', 'A1', 66), venda('3', 'A2', 66)];
    expect(fechamentoDoDia(SESSOES, vendas).sessaoMaisCheia).toBe('3');
  });

  it('no empate fica com a primeira da lista', () => {
    const vendas = [venda('1', 'A1', 45), venda('3', 'A1', 66)];
    expect(fechamentoDoDia(SESSOES, vendas).sessaoMaisCheia).toBe('1');
  });

  it('sessao cancelada nunca e a mais cheia', () => {
    const vendas = [venda('5', 'A1', 30), venda('5', 'A2', 30), venda('1', 'A1', 45)];
    expect(fechamentoDoDia(SESSOES, vendas).sessaoMaisCheia).toBe('1');
  });

  it('receita com tres meias noturnas arredonda certo', () => {
    const vendas = [venda('4', 'A1', 24.75), venda('4', 'A2', 24.75), venda('4', 'A3', 24.75)];
    expect(fechamentoDoDia(SESSOES, vendas).receita).toBe(74.25);
  });

  it('venda de sessao que nao existe nao conta', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('404', 'A1', 30)]);
    expect(fim.ingressos).toBe(0);
    expect(fim.receita).toBe(0);
  });

  it('sala lotada marca cem por cento', () => {
    const vinte = [];
    for (let i = 1; i <= 10; i += 1) {
      vinte.push(venda('3', 'A' + i, 66));
      vinte.push(venda('3', 'B' + i, 66));
    }
    const fim = fechamentoDoDia(SESSOES, vinte);
    expect(fim.ocupacaoPorSala.VIP).toBe(100);
  });

  it('so com a sessao cancelada o dia fica zerado', () => {
    const fim = fechamentoDoDia([SESSOES[4]], [venda('5', 'A1', 30)]);
    expect(fim.ingressos).toBe(0);
    expect(fim.sessaoMaisCheia).toBeNull();
  });

  it('sala da sessao cancelada nem aparece no mapa', () => {
    const fim = fechamentoDoDia([SESSOES[4]], []);
    expect(Object.keys(fim.ocupacaoPorSala)).toEqual([]);
  });

  it('no empate vale a ordem da grade, nao a ordem das vendas', () => {
    const vendas = [venda('4', 'A1', 49.5), venda('3', 'A1', 66)];
    expect(fechamentoDoDia(SESSOES, vendas).sessaoMaisCheia).toBe('3');
  });

  it('uma venda numa sala de duas sessoes arredonda para um por cento', () => {
    const fim = fechamentoDoDia(SESSOES, [venda('1', 'A1', 45)]);
    expect(fim.ocupacaoPorSala.IMAX).toBe(1);
  });
});
