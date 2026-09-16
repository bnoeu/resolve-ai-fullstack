const dashboardService = require('../services/dashboard.service');

async function indicadores(req, res) {
  const dados = await dashboardService.indicadores();
  res.json(dados);
}

module.exports = { indicadores };
