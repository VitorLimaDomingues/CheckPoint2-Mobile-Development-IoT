import { poltronaValida } from '../src/servicos/poltronaValida';

describe('poltronaValida', () => {
  it('poltrona normal existe', () => {
    expect(poltronaValida('A1', 60)).toBe(true);
  });

  it('aceita minuscula e espaco das pontas', () => {
    expect(poltronaValida(' b4 ', 60)).toBe(true);
  });

  it('a decima poltrona da fileira existe', () => {
    expect(poltronaValida('A10', 60)).toBe(true);
  });

  it('a decima primeira nao existe em sala nenhuma', () => {
    expect(poltronaValida('A11', 60)).toBe(false);
  });

  it('letra sozinha nao e poltrona', () => {
    expect(poltronaValida('A', 60)).toBe(false);
  });

  it('numero zero nao existe', () => {
    expect(poltronaValida('A0', 60)).toBe(false);
  });

  it('capacidade 30 vai ate a fileira C', () => {
    expect(poltronaValida('C10', 30)).toBe(true);
  });

  it('capacidade 30 nao tem fileira D', () => {
    expect(poltronaValida('D1', 30)).toBe(false);
  });

  it('capacidade 60 tem a fileira F e nao tem a G', () => {
    expect(poltronaValida('F10', 60)).toBe(true);
    expect(poltronaValida('G1', 60)).toBe(false);
  });

  it('texto sem numero nao passa', () => {
    expect(poltronaValida('AA', 60)).toBe(false);
  });

  it('minuscula tambem vale na decima poltrona', () => {
    expect(poltronaValida('f10', 60)).toBe(true);
  });

  it('sala de capacidade 10 so tem a fileira A', () => {
    expect(poltronaValida('A5', 10)).toBe(true);
  });

  it('sala de capacidade 10 nao tem fileira B', () => {
    expect(poltronaValida('B1', 10)).toBe(false);
  });

  it('capacidade 20 tem a fileira B inteira', () => {
    expect(poltronaValida('B10', 20)).toBe(true);
  });

  it('numero negativo nao existe', () => {
    expect(poltronaValida('A-1', 60)).toBe(false);
  });

  it('numero quebrado nao e poltrona', () => {
    expect(poltronaValida('A1.5', 60)).toBe(false);
  });

  it('numero antes da letra nao vale', () => {
    expect(poltronaValida('1A', 60)).toBe(false);
  });

  it('vazio e so espaco nao sao poltrona', () => {
    expect(poltronaValida('', 60)).toBe(false);
    expect(poltronaValida('   ', 60)).toBe(false);
  });
});
