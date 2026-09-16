const prisma = require('../config/prisma');

async function indicadores() {
  const [porStatus, porPrioridade, porCategoria, total] = await Promise.all([
    prisma.ocorrencia.groupBy({ by: ['status'], _count: true }),
    prisma.ocorrencia.groupBy({ by: ['prioridade'], _count: true }),
    prisma.ocorrencia.groupBy({ by: ['categoria'], _count: true }),
    prisma.ocorrencia.count(),
  ]);

  return {
    total,
    porStatus: porStatus.map((s) => ({ status: s.status, total: s._count })),
    porPrioridade: porPrioridade.map((p) => ({ prioridade: p.prioridade, total: p._count })),
    porCategoria: porCategoria.map((c) => ({ categoria: c.categoria, total: c._count })),
  };
}

module.exports = { indicadores };
