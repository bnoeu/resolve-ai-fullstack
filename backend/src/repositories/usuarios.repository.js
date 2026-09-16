const prisma = require('../config/prisma');

module.exports = {
  buscarPorEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
  },
  buscarPorId(id) {
    return prisma.usuario.findUnique({ where: { id } });
  },
  criar(data) {
    return prisma.usuario.create({ data });
  },
};
