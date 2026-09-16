# Resolve Aí — Plataforma de Gestão de Ocorrências

MVP Full Stack do Hackathon POSTECH (Full Stack Development, Fase 5).
Registra, acompanha e resolve ocorrências (iluminação, limpeza, segurança, manutenção etc.), com rastreabilidade completa do ciclo de vida.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + React Router + Axios |
| Backend | Node.js + Express |
| Banco | PostgreSQL + Prisma |
| Auth | JWT + bcrypt (RBAC: Solicitante / Gestor) |
| Testes | Jest + Supertest |
| Infra | Docker + Docker Compose |

## Estrutura

```
resolve-ai/
├── backend/            # API REST (Express + Prisma)
├── frontend/           # SPA React (Vite)
├── docker-compose.yml  # sobe db + api + frontend
└── README.md
```

## Subir tudo com Docker (recomendado)

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:3000/api
- Banco: PostgreSQL na porta 5432

Depois que subir, popule os usuários demo:

```bash
docker compose exec api npm run seed
```

## Usuários demo

| Perfil | E-mail | Senha |
|---|---|---|
| Gestor | gestor@resolveai.com | 123456 |
| Solicitante | solicitante@resolveai.com | 123456 |

## Rodar em modo desenvolvimento (sem Docker)

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run dev            # http://localhost:3000
```

**Frontend (em outro terminal):**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

## Testes

```bash
cd backend && npm test
```

## Funcionalidades

**Solicitante:** cria conta, registra ocorrência (título, descrição, categoria, localização, imagem por URL, prioridade), acompanha, comenta, consulta histórico e avalia a resolução.

**Gestor:** vê todas as ocorrências, filtra por categoria/status/prioridade, altera prioridade, atribui responsável, muda status (com registro de histórico), registra solução e vê o dashboard de indicadores.

**Ciclo de vida:** `ABERTA → EM_ANALISE → EM_ATENDIMENTO → RESOLVIDA`, com `CANCELADA` a partir dos estados ativos. Toda transição é validada e gera registro auditável em `historico_status`.

## Documentação

O documento de arquitetura, o diagrama ER e os detalhes de endpoints estão em `backend/README.md` e nos artefatos do projeto.
