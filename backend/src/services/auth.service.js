const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const usuariosRepository = require('../repositories/usuarios.repository');

function sanitizar(usuario) {
  const { senhaHash, ...rest } = usuario;
  return rest;
}

async function registrar({ nome, email, senha, perfil }) {
  const existente = await usuariosRepository.buscarPorEmail(email);
  if (existente) throw new AppError('E-mail já cadastrado', 409);

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await usuariosRepository.criar({
    nome,
    email,
    senhaHash,
    perfil: perfil === 'GESTOR' ? 'GESTOR' : 'SOLICITANTE',
  });

  return sanitizar(usuario);
}

async function login({ email, senha }) {
  const usuario = await usuariosRepository.buscarPorEmail(email);
  if (!usuario) throw new AppError('Credenciais inválidas', 401);

  const ok = await bcrypt.compare(senha, usuario.senhaHash);
  if (!ok) throw new AppError('Credenciais inválidas', 401);

  const token = jwt.sign(
    { id: usuario.id, perfil: usuario.perfil },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return { token, usuario: sanitizar(usuario) };
}

module.exports = { registrar, login };
