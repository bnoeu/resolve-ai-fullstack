// Testes de integração das rotas de ocorrência: autenticação, RBAC por perfil,
// validação e a máquina de estados (transições válidas x inválidas).
jest.mock('../src/config/prisma', () => ({}));
jest.mock('../src/repositories/ocorrencias.repository');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const env = require('../src/config/env');
const app = require('../src/app');
const ocorrenciasRepo = require('../src/repositories/ocorrencias.repository');

const token = (u) => jwt.sign({ id: u.id, perfil: u.perfil }, env.jwtSecret, { expiresIn: '1h' });
const solicitante = { id: 10, perfil: 'SOLICITANTE' };
const gestor = { id: 99, perfil: 'GESTOR' };

describe('Ocorrências', () => {
  beforeEach(() => jest.clearAllMocks());

  test('bloqueia acesso sem token (401)', async () => {
    const res = await request(app).get('/api/ocorrencias');
    expect(res.status).toBe(401);
  });

  test('solicitante cria ocorrência (201)', async () => {
    ocorrenciasRepo.criar.mockResolvedValue({ id: 1, titulo: 'Lâmpada', status: 'ABERTA' });
    const res = await request(app)
      .post('/api/ocorrencias')
      .set('Authorization', `Bearer ${token(solicitante)}`)
      .send({ titulo: 'Lâmpada', descricao: 'Corredor 2o andar', categoria: 'Iluminação' });
    expect(res.status).toBe(201);
    expect(ocorrenciasRepo.criar).toHaveBeenCalled();
  });

  test('gestor não pode criar ocorrência (403)', async () => {
    const res = await request(app)
      .post('/api/ocorrencias')
      .set('Authorization', `Bearer ${token(gestor)}`)
      .send({ titulo: 'x', descricao: 'y', categoria: 'z' });
    expect(res.status).toBe(403);
  });

  test('valida campos obrigatórios ao criar (400)', async () => {
    const res = await request(app)
      .post('/api/ocorrencias')
      .set('Authorization', `Bearer ${token(solicitante)}`)
      .send({ titulo: 'sem descricao e categoria' });
    expect(res.status).toBe(400);
  });

  test('solicitante lista apenas as próprias ocorrências', async () => {
    ocorrenciasRepo.listar.mockResolvedValue([]);
    await request(app)
      .get('/api/ocorrencias')
      .set('Authorization', `Bearer ${token(solicitante)}`);
    expect(ocorrenciasRepo.listar).toHaveBeenCalledWith(
      expect.objectContaining({ solicitanteId: solicitante.id })
    );
  });

  test('gestor muda status com transição válida e grava histórico (200)', async () => {
    ocorrenciasRepo.buscarPorId.mockResolvedValue({ id: 1, status: 'ABERTA', solicitanteId: 10 });
    ocorrenciasRepo.transicionarStatus.mockResolvedValue({ id: 1, status: 'EM_ANALISE' });

    const res = await request(app)
      .patch('/api/ocorrencias/1/status')
      .set('Authorization', `Bearer ${token(gestor)}`)
      .send({ status: 'EM_ANALISE', observacao: 'Em análise' });

    expect(res.status).toBe(200);
    expect(ocorrenciasRepo.transicionarStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        statusAnterior: 'ABERTA',
        statusNovo: 'EM_ANALISE',
        usuarioId: gestor.id,
      })
    );
  });

  test('rejeita transição de status inválida (400) e não grava histórico', async () => {
    ocorrenciasRepo.buscarPorId.mockResolvedValue({ id: 1, status: 'ABERTA', solicitanteId: 10 });
    const res = await request(app)
      .patch('/api/ocorrencias/1/status')
      .set('Authorization', `Bearer ${token(gestor)}`)
      .send({ status: 'RESOLVIDA' });

    expect(res.status).toBe(400);
    expect(ocorrenciasRepo.transicionarStatus).not.toHaveBeenCalled();
  });

  test('solicitante não pode mudar status (403)', async () => {
    const res = await request(app)
      .patch('/api/ocorrencias/1/status')
      .set('Authorization', `Bearer ${token(solicitante)}`)
      .send({ status: 'EM_ANALISE' });
    expect(res.status).toBe(403);
  });
});
