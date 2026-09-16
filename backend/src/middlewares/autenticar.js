const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');

// Valida o JWT e injeta { id, perfil } em req.usuario.
function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Token não fornecido', 401);
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.usuario = { id: payload.id, perfil: payload.perfil };
    next();
  } catch (err) {
    throw new AppError('Token inválido ou expirado', 401);
  }
}

module.exports = autenticar;
