const prisma = require('../config/prisma');

const resumoUsuario = { select: { id: true, nome: true } };

module.exports = {
  criar(data) {
    return prisma.ocorrencia.create({ data });
  },

  listar(where) {
    return prisma.ocorrencia.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { solicitante: resumoUsuario, responsavel: resumoUsuario },
    });
  },

  buscarPorId(id) {
    return prisma.ocorrencia.findUnique({
      where: { id },
      include: {
        solicitante: { select: { id: true, nome: true, email: true } },
        responsavel: { select: { id: true, nome: true, email: true } },
        comentarios: { include: { autor: resumoUsuario }, orderBy: { createdAt: 'asc' } },
        historicos: { include: { usuario: resumoUsuario }, orderBy: { createdAt: 'asc' } },
        avaliacao: true,
      },
    });
  },

  atualizar(id, data) {
    return prisma.ocorrencia.update({ where: { id }, data });
  },

  // Atualiza o status e grava o histórico na MESMA transação (atomicidade/auditoria).
  transicionarStatus({ id, statusAnterior, statusNovo, usuarioId, observacao }) {
    return prisma.$transaction(async (tx) => {
      const ocorrencia = await tx.ocorrencia.update({
        where: { id },
        data: { status: statusNovo },
      });
      await tx.historicoStatus.create({
        data: { ocorrenciaId: id, statusAnterior, statusNovo, usuarioId, observacao },
      });
      return ocorrencia;
    });
  },
};
