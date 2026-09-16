const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middlewares/autenticar');
const autorizar = require('../middlewares/autorizar');
const dashboard = require('../controllers/dashboard.controller');

const router = Router();

router.get(
  '/indicadores',
  autenticar,
  autorizar('GESTOR'),
  asyncHandler(dashboard.indicadores)
);

module.exports = router;
