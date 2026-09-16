// Testes de integração das rotas de autenticação.
// Estratégia: Supertest bate no app Express real; a camada de repositório é
// mockada (jest.mock) para não depender de um banco — assim os testes rodam
// em qualquer CI sem Postgres. O config/prisma é mockado para evitar instanciar
// o PrismaClient (que exigiria 'prisma generate').
jest.mock('../src/config/prisma', () => ({}));
jest.mock('../src/repositories/usuarios.repository');

const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const usuariosRepo = require('../src/repositories/usuarios.repository');

describe('Auth', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('POST /api/auth/register', () => {
    test('cria usuário e não retorna a senha', async () => {
      usuariosRepo.buscarPorEmail.mockResolvedValue(null);
      usuariosRepo.criar.mockImplementation(async (data) => ({ id: 1, ...data }));

      const res = await request(app)
        .post('/api/auth/register')
        .send({ nome: 'Ana', email: 'ana@x.com', senha: '123456' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('ana@x.com');
      expect(res.body.perfil).toBe('SOLICITANTE');
      expect(res.body).not.toHaveProperty('senhaHash');
    });

    test('retorna 400 quando faltam campos', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'a@a.com' });
      expect(res.status).toBe(400);
    });

    test('retorna 409 para e-mail já cadastrado', async () => {
      usuariosRepo.buscarPorEmail.mockResolvedValue({ id: 1, email: 'ana@x.com' });
      const res = await request(app)
        .post('/api/auth/register')
        .send({ nome: 'Ana', email: 'ana@x.com', senha: '123456' });
      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    test('retorna token com credenciais válidas', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      usuariosRepo.buscarPorEmail.mockResolvedValue({
        id: 1, nome: 'Ana', email: 'ana@x.com', senhaHash, perfil: 'SOLICITANTE',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@x.com', senha: '123456' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.usuario).not.toHaveProperty('senhaHash');
    });

    test('retorna 401 com senha incorreta', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      usuariosRepo.buscarPorEmail.mockResolvedValue({
        id: 1, email: 'ana@x.com', senhaHash, perfil: 'SOLICITANTE',
      });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'ana@x.com', senha: 'errada' });
      expect(res.status).toBe(401);
    });
  });
});
