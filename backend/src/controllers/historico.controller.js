const historicoRepository = require('../repositories/historico.repository');
const ocorrenciasService = require('../services/ocorrencias.service');

async function listar(req, res) {
  const id = Number(req.params.id);
  // Valida acesso à ocorrência antes de expor o histórico.
  await ocorrenciasService.buscarPorId({ id, usuario: req.usuario });
  const lista = await historicoRepository.listarPorOcorrencia(id);
  res.json(lista);
}

module.exports = { listar };
