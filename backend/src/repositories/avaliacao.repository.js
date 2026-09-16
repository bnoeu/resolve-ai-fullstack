const prisma = require('../config/prisma');

module.exports = {
  criar(data) {
    return prisma.avaliacao.create({ data });
  },
  buscarPorOcorrencia(ocorrenciaId) {
    return prisma.avaliacao.findUnique({ where: { ocorrenciaId } });
  },
};
