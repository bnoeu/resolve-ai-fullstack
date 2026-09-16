const AppError = require('../utils/AppError');

// RBAC: só permite os perfis informados. Ex.: autorizar('GESTOR').
function autorizar(...perfis) {
  return (req, res, next) => {
    if (!req.usuario || !perfis.includes(req.usuario.perfil)) {
      throw new AppError('Acesso negado para este perfil', 403);
    }
    next();
  };
}

module.exports = autorizar;
