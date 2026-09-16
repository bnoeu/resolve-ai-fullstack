const comentariosService = require('../services/comentarios.service');

async function adicionar(req, res) {
  const comentario = await comentariosService.adicionar({
    ocorrenciaId: Number(req.params.id),
    autor: req.usuario,
    texto: req.body.texto,
  });
  res.status(201).json(comentario);
}

async function listar(req, res) {
  const lista = await comentariosService.listar({
    ocorrenciaId: Number(req.params.id),
    usuario: req.usuario,
  });
  res.json(lista);
}

module.exports = { adicionar, listar };
