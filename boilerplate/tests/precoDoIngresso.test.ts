import { precoDoIngresso } from '../src/servicos/precoDoIngresso';

describe('precoDoIngresso', () => {
  it('inteira de tarde e o preco base', () => {
    expect(precoDoIngresso(30, false, '14:00')).toBe(30);
  });

  it('meia-entrada paga metade', () => {
    expect(precoDoIngresso(30, true, '14:00')).toBe(15);
  });

  it('noturna custa 10% a mais', () => {
    expect(precoDoIngresso(30, false, '21:00')).toBe(33);
  });

  it('as 18:00 em ponto ja e noturna', () => {
    expect(precoDoIngresso(30, false, '18:00')).toBe(33);
  });

  it('as 17:59 ainda nao e', () => {
    expect(precoDoIngresso(30, false, '17:59')).toBe(30);
  });

  it('meia e noturna se somam, com o acrescimo depois do desconto', () => {
    expect(precoDoIngresso(45, true, '21:00')).toBe(24.75);
  });

  it('arredonda para duas casas', () => {
    expect(precoDoIngresso(45, true, '14:00')).toBe(22.5);
  });

  it('preco base da VIP a noite', () => {
    expect(precoDoIngresso(60, false, '19:30')).toBe(66);
  });

  it('meia a noite tambem leva o acrescimo', () => {
    expect(precoDoIngresso(30, true, '21:00')).toBe(16.5);
  });

  it('18:01 tambem ja e noturna', () => {
    expect(precoDoIngresso(30, false, '18:01')).toBe(33);
  });

  it('depois da meia-noite a hora volta a ser pequena', () => {
    expect(precoDoIngresso(30, false, '00:30')).toBe(30);
  });

  it('23:59 ainda e noturna', () => {
    expect(precoDoIngresso(30, false, '23:59')).toBe(33);
  });

  it('meia da VIP de tarde e metade exata', () => {
    expect(precoDoIngresso(60, true, '15:00')).toBe(30);
  });

  it('base quebrada, meia e noite: arredonda no final', () => {
    expect(precoDoIngresso(35, true, '20:00')).toBe(19.25);
  });

  it('preco base com centavos passa reto de tarde', () => {
    expect(precoDoIngresso(49.9, false, '12:00')).toBe(49.9);
  });

  it('meia de base com centavos arredonda certo', () => {
    expect(precoDoIngresso(49.9, true, '10:00')).toBe(24.95);
  });
});
