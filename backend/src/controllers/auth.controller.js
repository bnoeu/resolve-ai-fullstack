const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');

async function registrar(req, res) {
  const { nome, email, senha, perfil } = req.body;
  if (!nome || !email || !senha) {
    throw new AppError('nome, email e senha são obrigatórios');
  }
  const usuario = await authService.registrar({ nome, email, senha, perfil });
  res.status(201).json(usuario);
}

async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) throw new AppError('email e senha são obrigatórios');
  const resultado = await authService.login({ email, senha });
  res.json(resultado);
}

module.exports = { registrar, login };
