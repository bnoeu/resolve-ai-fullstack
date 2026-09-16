const prisma = require('../config/prisma');

module.exports = {
  listarPorOcorrencia(ocorrenciaId) {
    return prisma.historicoStatus.findMany({
      where: { ocorrenciaId },
      include: { usuario: { select: { id: true, nome: true } } },
      orderBy: { createdAt: 'asc' },
    });
  },
};
