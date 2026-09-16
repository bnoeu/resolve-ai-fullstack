const AppError = require('../utils/AppError');
const avaliacaoRepository = require('../repositories/avaliacao.repository');
const ocorrenciasService = require('./ocorrencias.service');

async function avaliar({ ocorrenciaId, usuario, nota, comentario }) {
  const ocorrencia = await ocorrenciasService.buscarPorId({ id: ocorrenciaId, usuario });

  if (ocorrencia.solicitanteId !== usuario.id) {
    throw new AppError('Apenas o solicitante pode avaliar a ocorrência', 403);
  }
  if (ocorrencia.status !== 'RESOLVIDA') {
    throw new AppError('Só é possível avaliar ocorrências resolvidas');
  }
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    throw new AppError('nota deve ser um inteiro de 1 a 5');
  }

  const existente = await avaliacaoRepository.buscarPorOcorrencia(ocorrenciaId);
  if (existente) throw new AppError('Ocorrência já avaliada', 409);

  return avaliacaoRepository.criar({ ocorrenciaId, nota, comentario });
}

module.exports = { avaliar };
