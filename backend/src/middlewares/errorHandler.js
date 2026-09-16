const AppError = require('../utils/AppError');

// Middleware central de tratamento de erros.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  // Violação de unicidade do Prisma (ex.: e-mail duplicado)
  if (err.code === 'P2002') {
    return res.status(409).json({ erro: 'Registro já existente' });
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = errorHandler;
