const AppError = require('../utils/AppError');
const { podeTransicionar } = require('../utils/statusMachine');
const ocorrenciasRepository = require('../repositories/ocorrencias.repository');

async function garantirExiste(id) {
  const ocorrencia = await ocorrenciasRepository.buscarPorId(id);
  if (!ocorrencia) throw new AppError('Ocorrência não encontrada', 404);
  return ocorrencia;
}

async function criar({ dados, solicitanteId }) {
  const { titulo, descricao, categoria, localizacao, imagemUrl, prioridade } = dados;
  if (!titulo || !descricao || !categoria) {
    throw new AppError('titulo, descricao e categoria são obrigatórios');
  }

  // Cria a ocorrência já com o primeiro registro de histórico (null -> ABERTA).
  return ocorrenciasRepository.criar({
    titulo,
    descricao,
    categoria,
    localizacao,
    imagemUrl,
    prioridade: prioridade || 'MEDIA',
    solicitanteId,
    historicos: {
      create: {
        statusAnterior: null,
        statusNovo: 'ABERTA',
        usuarioId: solicitanteId,
        observacao: 'Ocorrência registrada',
      },
    },
  });
}

async function listar({ usuario, filtros }) {
  const where = {};
  if (filtros.categoria) where.categoria = filtros.categoria;
  if (filtros.status) where.status = filtros.status;
  if (filtros.prioridade) where.prioridade = filtros.prioridade;

  // Solicitante só enxerga as próprias ocorrências.
  if (usuario.perfil === 'SOLICITANTE') where.solicitanteId = usuario.id;

  return ocorrenciasRepository.listar(where);
}

async function buscarPorId({ id, usuario }) {
  const ocorrencia = await garantirExiste(id);
  if (usuario.perfil === 'SOLICITANTE' && ocorrencia.solicitanteId !== usuario.id) {
    throw new AppError('Acesso negado', 403);
  }
  return ocorrencia;
}

async function atualizarStatus({ id, statusNovo, observacao, usuario }) {
  const ocorrencia = await garantirExiste(id);
  if (!statusNovo) throw new AppError('status é obrigatório');

  if (!podeTransicionar(ocorrencia.status, statusNovo)) {
    throw new AppError(`Transição inválida: ${ocorrencia.status} -> ${statusNovo}`);
  }

  return ocorrenciasRepository.transicionarStatus({
    id,
    statusAnterior: ocorrencia.status,
    statusNovo,
    usuarioId: usuario.id,
    observacao,
  });
}

async function alterarPrioridade({ id, prioridade }) {
  const validos = ['BAIXA', 'MEDIA', 'ALTA'];
  if (!validos.includes(prioridade)) throw new AppError('Prioridade inválida');
  await garantirExiste(id);
  return ocorrenciasRepository.atualizar(id, { prioridade });
}

async function atribuirResponsavel({ id, responsavelId }) {
  if (!responsavelId) throw new AppError('responsavelId é obrigatório');
  await garantirExiste(id);
  return ocorrenciasRepository.atualizar(id, { responsavelId });
}

async function registrarSolucao({ id, solucaoAplicada }) {
  if (!solucaoAplicada) throw new AppError('solucaoAplicada é obrigatória');
  await garantirExiste(id);
  return ocorrenciasRepository.atualizar(id, { solucaoAplicada });
}

module.exports = {
  criar,
  listar,
  buscarPorId,
  atualizarStatus,
  alterarPrioridade,
  atribuirResponsavel,
  registrarSolucao,
};
