const ocorrenciasService = require('../services/ocorrencias.service');

async function criar(req, res) {
  const ocorrencia = await ocorrenciasService.criar({
    dados: req.body,
    solicitanteId: req.usuario.id,
  });
  res.status(201).json(ocorrencia);
}

async function listar(req, res) {
  const lista = await ocorrenciasService.listar({ usuario: req.usuario, filtros: req.query });
  res.json(lista);
}

async function buscarPorId(req, res) {
  const ocorrencia = await ocorrenciasService.buscarPorId({
    id: Number(req.params.id),
    usuario: req.usuario,
  });
  res.json(ocorrencia);
}

async function atualizarStatus(req, res) {
  const ocorrencia = await ocorrenciasService.atualizarStatus({
    id: Number(req.params.id),
    statusNovo: req.body.status,
    observacao: req.body.observacao,
    usuario: req.usuario,
  });
  res.json(ocorrencia);
}

async function alterarPrioridade(req, res) {
  const ocorrencia = await ocorrenciasService.alterarPrioridade({
    id: Number(req.params.id),
    prioridade: req.body.prioridade,
  });
  res.json(ocorrencia);
}

async function atribuirResponsavel(req, res) {
  const ocorrencia = await ocorrenciasService.atribuirResponsavel({
    id: Number(req.params.id),
    responsavelId: Number(req.body.responsavelId),
  });
  res.json(ocorrencia);
}

async function registrarSolucao(req, res) {
  const ocorrencia = await ocorrenciasService.registrarSolucao({
    id: Number(req.params.id),
    solucaoAplicada: req.body.solucaoAplicada,
  });
  res.json(ocorrencia);
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
