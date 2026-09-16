// Máquina de estados do ciclo de vida da ocorrência.
// Define quais transições de status são permitidas.
const transicoesValidas = {
  ABERTA: ['EM_ANALISE', 'CANCELADA'],
  EM_ANALISE: ['EM_ATENDIMENTO', 'CANCELADA'],
  EM_ATENDIMENTO: ['RESOLVIDA', 'CANCELADA'],
  RESOLVIDA: [],
  CANCELADA: [],
};

function podeTransicionar(atual, novo) {
  return (transicoesValidas[atual] || []).includes(novo);
}

module.exports = { transicoesValidas, podeTransicionar };
