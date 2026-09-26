import { venderIngresso } from '../src/servicos/venderIngresso';
import { PedidoVenda } from '../src/tipos';
import { motivoDe, vendaDe } from './ajuda';
import { SALA_PEQUENA, SESSOES, venda } from './fixtures';

function pedido(parcial: Partial<PedidoVenda>): PedidoVenda {
  return { sessaoId: '1', poltrona: 'A1', idade: 30, tipo: 'INTEIRA', ...parcial };
}

describe('venderIngresso — quando vende', () => {
  it('devolve tipo VENDIDO', () => {
    expect(venderIngresso(pedido({}), SESSOES, []).tipo).toBe('VENDIDO');
  });

  it('a venda guarda sessao, poltrona e tipo do pedido', () => {
    const feita = vendaDe(venderIngresso(pedido({ sessaoId: '2', poltrona: 'C7' }), SESSOES, []));
    expect(feita.sessaoId).toBe('2');
    expect(feita.poltrona).toBe('C7');
    expect(feita.tipo).toBe('INTEIRA');
  });

  it('guarda a poltrona limpa, sem espaco e em maiuscula', () => {
    const feita = vendaDe(venderIngresso(pedido({ poltrona: ' b4 ' }), SESSOES, []));
    expect(feita.poltrona).toBe('B4');
  });

  it('sala PADRAO de tarde custa 30', () => {
    const feita = vendaDe(venderIngresso(pedido({ sessaoId: '2' }), SESSOES, []));
    expect(feita.preco).toBe(30);
  });

  it('sala IMAX de tarde custa 45', () => {
    expect(vendaDe(venderIngresso(pedido({}), SESSOES, [])).preco).toBe(45);
  });

  it('sala VIP a noite custa 66', () => {
    const feita = vendaDe(venderIngresso(pedido({ sessaoId: '3' }), SESSOES, []));
    expect(feita.preco).toBe(66);
  });

  it('meia-entrada de estudante vale metade', () => {
    const feita = vendaDe(venderIngresso(pedido({ tipo: 'ESTUDANTE' }), SESSOES, []));
    expect(feita.preco).toBe(22.5);
  });

  it('idoso e crianca tambem pagam metade', () => {
    const idoso = vendaDe(venderIngresso(pedido({ sessaoId: '2', tipo: 'IDOSO' }), SESSOES, []));
    const crianca = vendaDe(
      venderIngresso(pedido({ sessaoId: '2', poltrona: 'A2', tipo: 'CRIANCA', idade: 8 }), SESSOES, [])
    );
    expect(idoso.preco).toBe(15);
    expect(crianca.preco).toBe(15);
  });

  it('sessao das 21h e noturna e leva o acrescimo', () => {
    const feita = vendaDe(venderIngresso(pedido({ sessaoId: '4' }), SESSOES, []));
    expect(feita.preco).toBe(49.5);
  });

  it('meia-entrada e acrescimo noturno se somam', () => {
    const feita = vendaDe(
      venderIngresso(pedido({ sessaoId: '4', tipo: 'ESTUDANTE' }), SESSOES, [])
    );
    expect(feita.preco).toBe(24.75);
  });

  it('a sessao das 18:00 em ponto ja e noturna', () => {
    const dezoito = { ...SESSOES[1], id: '77', horario: '18:00' };
    const feita = vendaDe(venderIngresso(pedido({ sessaoId: '77' }), [dezoito], []));
    expect(feita.preco).toBe(33);
  });

  it('nao mexe na lista de vendas que recebeu', () => {
    const vendas = [venda('1', 'A1', 45)];
    venderIngresso(pedido({ poltrona: 'A2' }), SESSOES, vendas);
    expect(vendas).toHaveLength(1);
  });

  it('a venda guarda o tipo meia do pedido', () => {
    const feita = vendaDe(venderIngresso(pedido({ tipo: 'ESTUDANTE' }), SESSOES, []));
    expect(feita.tipo).toBe('ESTUDANTE');
  });

  it('VIP a noite com meia de estudante', () => {
    const feita = vendaDe(
      venderIngresso(pedido({ sessaoId: '3', tipo: 'ESTUDANTE', idade: 20 }), SESSOES, [])
    );
    expect(feita.preco).toBe(33);
  });

  it('a decima poltrona da ultima fileira vende', () => {
    expect(venderIngresso(pedido({ poltrona: 'F10' }), SESSOES, []).tipo).toBe('VENDIDO');
  });

  it('as 17:59 ainda nao e noturna', () => {
    const cedo = { ...SESSOES[1], id: '78', horario: '17:59' };
    const feita = vendaDe(venderIngresso(pedido({ sessaoId: '78' }), [cedo], []));
    expect(feita.preco).toBe(30);
  });

  it('resultado vendido nao carrega motivo', () => {
    const r = venderIngresso(pedido({}), SESSOES, []);
    expect(Object.keys(r)).not.toContain('motivo');
  });
});

describe('venderIngresso — quando recusa', () => {
  it('sessao que nao existe', () => {
    const r = venderIngresso(pedido({ sessaoId: '404' }), SESSOES, []);
    expect(r.tipo).toBe('RECUSADO');
    expect(motivoDe(r)).toBe('sessao nao encontrada');
  });

  it('sessao cancelada', () => {
    expect(motivoDe(venderIngresso(pedido({ sessaoId: '5' }), SESSOES, []))).toBe('sessao cancelada');
  });

  it('poltrona de uma fileira que a sala nao tem', () => {
    expect(motivoDe(venderIngresso(pedido({ sessaoId: '3', poltrona: 'F1' }), SESSOES, []))).toBe(
      'poltrona invalida'
    );
  });

  it('poltrona com numero fora do intervalo', () => {
    expect(motivoDe(venderIngresso(pedido({ poltrona: 'A11' }), SESSOES, []))).toBe(
      'poltrona invalida'
    );
  });

  it('poltrona sem numero nenhum', () => {
    expect(motivoDe(venderIngresso(pedido({ poltrona: 'A' }), SESSOES, []))).toBe(
      'poltrona invalida'
    );
  });

  it('poltrona ja vendida', () => {
    const vendas = [venda('1', 'A1', 45)];
    expect(motivoDe(venderIngresso(pedido({}), SESSOES, vendas))).toBe('poltrona ocupada');
  });

  it('poltrona ja vendida, escrita em minuscula', () => {
    const vendas = [venda('1', 'A1', 45)];
    expect(motivoDe(venderIngresso(pedido({ poltrona: 'a1' }), SESSOES, vendas))).toBe(
      'poltrona ocupada'
    );
  });

  it('a mesma poltrona em outra sessao nao atrapalha', () => {
    const vendas = [venda('2', 'A1', 30)];
    expect(venderIngresso(pedido({}), SESSOES, vendas).tipo).toBe('VENDIDO');
  });

  it('sala cheia: nao sobra poltrona livre para vender', () => {
    const cheias = [];
    for (let i = 1; i <= 10; i += 1) {
      cheias.push(venda('99', 'A' + i, 30));
    }
    const r = venderIngresso(pedido({ sessaoId: '99', poltrona: 'A5' }), [SALA_PEQUENA], cheias);
    expect(motivoDe(r)).toBe('poltrona ocupada');
  });

  it('idade abaixo da classificacao', () => {
    expect(motivoDe(venderIngresso(pedido({ sessaoId: '3', idade: 17 }), SESSOES, []))).toBe(
      'idade abaixo da classificacao'
    );
  });

  it('a idade exata da classificacao passa', () => {
    expect(venderIngresso(pedido({ sessaoId: '3', idade: 18 }), SESSOES, []).tipo).toBe('VENDIDO');
  });

  it('filme LIVRE nao barra ninguem', () => {
    expect(venderIngresso(pedido({ sessaoId: '2', idade: 3 }), SESSOES, []).tipo).toBe('VENDIDO');
  });

  it('sessao cancelada recusa antes de olhar a poltrona', () => {
    expect(motivoDe(venderIngresso(pedido({ sessaoId: '5', poltrona: 'Z9' }), SESSOES, []))).toBe(
      'sessao cancelada'
    );
  });

  it('poltrona invalida recusa antes de olhar a idade', () => {
    const r = venderIngresso(pedido({ sessaoId: '3', poltrona: 'F1', idade: 10 }), SESSOES, []);
    expect(motivoDe(r)).toBe('poltrona invalida');
  });

  it('sessao inexistente recusa antes de tudo', () => {
    const r = venderIngresso(pedido({ sessaoId: '404', poltrona: 'Z99', idade: 1 }), SESSOES, []);
    expect(motivoDe(r)).toBe('sessao nao encontrada');
  });

  it('poltrona ocupada recusa antes da idade', () => {
    const vendas = [venda('3', 'A1', 66)];
    const r = venderIngresso(pedido({ sessaoId: '3', idade: 10 }), SESSOES, vendas);
    expect(motivoDe(r)).toBe('poltrona ocupada');
  });

  it('resultado recusado nao carrega venda', () => {
    const r = venderIngresso(pedido({ sessaoId: '404' }), SESSOES, []);
    expect(Object.keys(r)).not.toContain('venda');
  });
});
