const AppError = require('../utils/AppError');
const comentariosRepository = require('../repositories/comentarios.repository');
const ocorrenciasService = require('./ocorrencias.service');

async function adicionar({ ocorrenciaId, autor, texto }) {
  if (!texto) throw new AppError('texto é obrigatório');
  // Reaproveita a regra de visibilidade da ocorrência.
  await ocorrenciasService.buscarPorId({ id: ocorrenciaId, usuario: autor });
  return comentariosRepository.criar({ ocorrenciaId, autorId: autor.id, texto });
}

async function listar({ ocorrenciaId, usuario }) {
  await ocorrenciasService.buscarPorId({ id: ocorrenciaId, usuario });
  return comentariosRepository.listarPorOcorrencia(ocorrenciaId);
}

module.exports = { adicionar, listar };
