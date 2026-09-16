const prisma = require('../config/prisma');

module.exports = {
  criar(data) {
    return prisma.comentario.create({
      data,
      include: { autor: { select: { id: true, nome: true } } },
    });
  },
  listarPorOcorrencia(ocorrenciaId) {
    return prisma.comentario.findMany({
      where: { ocorrenciaId },
      include: { autor: { select: { id: true, nome: true } } },
      orderBy: { createdAt: 'asc' },
    });
  },
};
