const avaliacaoService = require('../services/avaliacao.service');

async function avaliar(req, res) {
  const avaliacao = await avaliacaoService.avaliar({
    ocorrenciaId: Number(req.params.id),
    usuario: req.usuario,
    nota: Number(req.body.nota),
    comentario: req.body.comentario,
  });
  res.status(201).json(avaliacao);
}

module.exports = { avaliar };
