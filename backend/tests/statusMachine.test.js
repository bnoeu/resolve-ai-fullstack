const { podeTransicionar } = require('../src/utils/statusMachine');

describe('Máquina de estados da ocorrência', () => {
  test('permite ABERTA -> EM_ANALISE', () => {
    expect(podeTransicionar('ABERTA', 'EM_ANALISE')).toBe(true);
  });

  test('permite EM_ATENDIMENTO -> RESOLVIDA', () => {
    expect(podeTransicionar('EM_ATENDIMENTO', 'RESOLVIDA')).toBe(true);
  });

  test('bloqueia pulo de ABERTA -> RESOLVIDA', () => {
    expect(podeTransicionar('ABERTA', 'RESOLVIDA')).toBe(false);
  });

  test('estados terminais não transicionam', () => {
    expect(podeTransicionar('RESOLVIDA', 'ABERTA')).toBe(false);
    expect(podeTransicionar('CANCELADA', 'EM_ANALISE')).toBe(false);
  });

  test('permite cancelar a partir de qualquer estado ativo', () => {
    expect(podeTransicionar('ABERTA', 'CANCELADA')).toBe(true);
    expect(podeTransicionar('EM_ANALISE', 'CANCELADA')).toBe(true);
    expect(podeTransicionar('EM_ATENDIMENTO', 'CANCELADA')).toBe(true);
  });
});
