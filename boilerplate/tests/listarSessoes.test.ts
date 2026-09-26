import { listarSessoes } from '../src/servicos/listarSessoes';
import { SALA_PEQUENA, SESSOES, venda } from './fixtures';

describe('listarSessoes', () => {
  it('devolve um resumo para cada sessao, na mesma ordem', () => {
    const grade = listarSessoes(SESSOES, []);
    expect(grade).toHaveLength(5);
    expect(grade.map((s) => s.id)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('traz o titulo do filme, nao o filme inteiro', () => {
    const grade = listarSessoes(SESSOES, []);
    expect(grade[0].titulo).toBe('Duna');
    expect(grade[1].titulo).toBe('Meu Malvado Favorito');
  });

  it('copia sala, formato, horario e capacidade da sessao', () => {
    const primeira = listarSessoes(SESSOES, [])[0];
    expect(primeira.sala).toBe('IMAX');
    expect(primeira.formato).toBe('LEGENDADO');
    expect(primeira.horario).toBe('14:00');
    expect(primeira.capacidade).toBe(60);
  });

  it('conta so as vendas da propria sessao', () => {
    const vendas = [venda('1', 'A1', 45), venda('1', 'A2', 45), venda('3', 'B1', 66)];
    const grade = listarSessoes(SESSOES, vendas);
    expect(grade[0].vendidos).toBe(2);
    expect(grade[1].vendidos).toBe(0);
    expect(grade[2].vendidos).toBe(1);
  });

  it('sem venda nenhuma, todas as sessoes abertas ficam com zero', () => {
    const grade = listarSessoes(SESSOES, []);
    expect(grade[0].vendidos).toBe(0);
    expect(grade[3].vendidos).toBe(0);
  });

  it('sessao normal com lugar sobrando fica ABERTA', () => {
    const grade = listarSessoes(SESSOES, [venda('1', 'A1', 45)]);
    expect(grade[0].status).toBe('ABERTA');
  });

  it('sessao cancelada fica ENCERRADA', () => {
    const grade = listarSessoes(SESSOES, []);
    expect(grade[4].status).toBe('ENCERRADA');
  });

  it('sessao sem poltrona sobrando fica ESGOTADA', () => {
    const cheias = [];
    for (let i = 1; i <= 10; i += 1) {
      cheias.push(venda('99', 'A' + i, 30));
    }
    const grade = listarSessoes([SALA_PEQUENA], cheias);
    expect(grade[0].status).toBe('ESGOTADA');
    expect(grade[0].vendidos).toBe(10);
  });

  it('cancelada ganha ENCERRADA mesmo estando cheia', () => {
    const cheias = [];
    for (let i = 1; i <= 40; i += 1) {
      cheias.push(venda('5', 'A' + i, 30));
    }
    const grade = listarSessoes(SESSOES, cheias);
    expect(grade[4].status).toBe('ENCERRADA');
  });

  it('lista vazia entra e lista vazia sai', () => {
    expect(listarSessoes([], [])).toEqual([]);
  });

  it('o resumo guarda o id da propria sessao', () => {
    const grade = listarSessoes(SESSOES, []);
    expect(grade[2].id).toBe('3');
  });

  it('o resumo nao carrega o objeto filme inteiro', () => {
    const grade = listarSessoes(SESSOES, []);
    expect(Object.keys(grade[0])).not.toContain('filme');
  });

  it('faltando um lugar a sessao ainda esta ABERTA', () => {
    const quase = [];
    for (let i = 1; i <= 9; i += 1) {
      quase.push(venda('99', 'A' + i, 30));
    }
    const grade = listarSessoes([SALA_PEQUENA], quase);
    expect(grade[0].vendidos).toBe(9);
    expect(grade[0].status).toBe('ABERTA');
  });

  it('venda de sessao que nao esta na grade nao conta', () => {
    const grade = listarSessoes(SESSOES, [venda('404', 'A1', 30)]);
    expect(grade[0].vendidos).toBe(0);
  });

  it('funciona com um recorte da grade, na ordem do recorte', () => {
    const grade = listarSessoes([SESSOES[2], SESSOES[0]], []);
    expect(grade.map((s) => s.id)).toEqual(['3', '1']);
  });
});
