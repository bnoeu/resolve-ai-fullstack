# Resolve Aí — Backend

API REST do **Resolve Aí**, plataforma de gestão de ocorrências (Hackathon POSTECH — Full Stack Development, Fase 5).

**Stack:** Node.js · Express · Prisma · PostgreSQL · JWT · Jest · Docker

---

## Arquitetura

Organização em camadas: `rotas → controllers → services → repositories`, com middlewares de autenticação (JWT) e autorização por perfil (RBAC).

```
src/
├── config/        # env e cliente Prisma
├── middlewares/   # autenticar (JWT), autorizar (RBAC), errorHandler
├── utils/         # AppError, asyncHandler, statusMachine
├── routes/        # definição dos endpoints
├── controllers/   # entrada/saída HTTP
├── services/      # regras de negócio
├── repositories/  # acesso a dados (Prisma)
├── app.js         # configuração do Express
└── server.js      # bootstrap
```

## Rodando com Docker (recomendado)

```bash
docker compose up --build
```

Sobe o PostgreSQL e a API (aplica as migrations automaticamente). API em `http://localhost:3000`.

Para popular usuários de teste depois que os containers subirem:

```bash
docker compose exec api npm run seed
```

## Rodando localmente

```bash
cp .env.example .env          # ajuste DATABASE_URL e JWT_SECRET
npm install
npx prisma migrate dev        # cria o banco e as tabelas
npm run seed                  # (opcional) usuários demo
npm run dev                   # sobe com hot reload
```

## Usuários demo (após o seed)

| Perfil | E-mail | Senha |
|---|---|---|
| Gestor | gestor@resolveai.com | 123456 |
| Solicitante | solicitante@resolveai.com | 123456 |

## Endpoints principais

Base: `/api` · Autenticação via header `Authorization: Bearer <token>`.

### Auth
- `POST /auth/register` — cria conta (`nome`, `email`, `senha`, `perfil` opcional)
- `POST /auth/login` — retorna `{ token, usuario }`

### Ocorrências
- `POST /ocorrencias` *(Solicitante)* — cria ocorrência
- `GET /ocorrencias` — lista (Gestor vê todas; Solicitante só as próprias). Filtros: `?categoria=&status=&prioridade=`
- `GET /ocorrencias/:id` — detalhe (com comentários, histórico e avaliação)
- `PATCH /ocorrencias/:id/status` *(Gestor)* — muda status e grava histórico
- `PATCH /ocorrencias/:id/prioridade` *(Gestor)*
- `PATCH /ocorrencias/:id/responsavel` *(Gestor)*
- `PATCH /ocorrencias/:id/solucao` *(Gestor)*

### Comentários, histórico e avaliação
- `GET /ocorrencias/:id/comentarios` · `POST /ocorrencias/:id/comentarios`
- `GET /ocorrencias/:id/historico`
- `POST /ocorrencias/:id/avaliacao` *(Solicitante, após RESOLVIDA)* — `nota` (1–5), `comentario`

### Dashboard
- `GET /dashboard/indicadores` *(Gestor)* — totais por status, prioridade e categoria

### Ciclo de vida
`ABERTA → EM_ANALISE → EM_ATENDIMENTO → RESOLVIDA`, com `CANCELADA` a partir dos estados ativos. Transições inválidas são rejeitadas no service, e **toda** mudança gera registro em `historico_status` na mesma transação.

## Testes

```bash
npm test
```

## Exemplo rápido (curl)

```bash
# login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"solicitante@resolveai.com","senha":"123456"}'

# criar ocorrência (use o token retornado acima)
curl -X POST http://localhost:3000/api/ocorrencias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"titulo":"Lâmpada queimada","descricao":"Corredor do 2º andar","categoria":"Iluminação"}'
```
