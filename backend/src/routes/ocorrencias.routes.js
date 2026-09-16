const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const ocorrencias = require('../controllers/ocorrencias.controller');
const comentarios = require('../controllers/comentarios.controller');
const historico = require('../controllers/historico.controller');
const avaliacao = require('../controllers/avaliacao.controller');

const router = Router();

// Todas as rotas de ocorrência exigem autenticação.
router.use(autenticar);

// Solicitante cria; ambos listam/consultam (visibilidade tratada no service).
router.post('/', autorizar('SOLICITANTE'), asyncHandler(ocorrencias.criar));
router.get('/', asyncHandler(ocorrencias.listar));
router.get('/:id', asyncHandler(ocorrencias.buscarPorId));

// Ações exclusivas do gestor.
router.patch('/:id/status', autorizar('GESTOR'), asyncHandler(ocorrencias.atualizarStatus));
router.patch('/:id/prioridade', autorizar('GESTOR'), asyncHandler(ocorrencias.alterarPrioridade));
router.patch('/:id/responsavel', autorizar('GESTOR'), asyncHandler(ocorrencias.atribuirResponsavel));
router.patch('/:id/solucao', autorizar('GESTOR'), asyncHandler(ocorrencias.registrarSolucao));

// Comentários e histórico (ambos os perfis, respeitando visibilidade).
router.get('/:id/comentarios', asyncHandler(comentarios.listar));
router.post('/:id/comentarios', asyncHandler(comentarios.adicionar));
router.get('/:id/historico', asyncHandler(historico.listar));

// Avaliação da resolução (solicitante).
router.post('/:id/avaliacao', autorizar('SOLICITANTE'), asyncHandler(avaliacao.avaliar));

module.exports = router;
