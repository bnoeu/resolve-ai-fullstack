# Deploy em Cloud (Render)

Guia para publicar o Resolve Aí (API + banco + frontend) no [Render](https://render.com), usando o Blueprint (`render.yaml`) na raiz do projeto — provisiona os três recursos de uma vez.

## Pré-requisitos

- Repositório no GitHub com o código (já feito: [github.com/bnoeu/resolve-ai-fullstack](https://github.com/bnoeu/resolve-ai-fullstack)).
- Conta no Render (não exige cartão no plano free).

## Passo a passo

1. **New > Blueprint** no dashboard do Render.
2. Conecte a conta do GitHub e selecione o repositório `resolve-ai-fullstack`.
3. O Render lê o `render.yaml` da raiz e propõe 3 recursos:
   - `resolve-ai-db` — Postgres gerenciado.
   - `resolve-ai-api` — Web Service via Docker (`backend/Dockerfile`).
   - `resolve-ai-frontend` — Static Site (build do Vite).
4. Confirme e aplique o Blueprint. O `JWT_SECRET` é gerado automaticamente e o `DATABASE_URL` da API já vem ligado ao banco — nada para copiar manualmente.
5. Aguarde os três serviços ficarem **Live**.

## Ajuste de URL entre front e back

O subdomínio de cada serviço no Render precisa ser único na plataforma inteira. Se `resolve-ai-api` já estiver em uso, o Render sufixa o nome (ex.: `resolve-ai-api-xyz1.onrender.com`).

Nesse caso:

1. Copie a URL pública real do serviço `resolve-ai-api`.
2. No serviço `resolve-ai-frontend` → **Environment**, atualize `VITE_API_URL` para `https://<url-real-da-api>/api`.
3. Dispare um **Manual Deploy** do frontend (o Vite embute essa variável no build, então precisa rebuildar).

## Popular os usuários demo

Depois que a API estiver Live, abra o **Shell** do serviço `resolve-ai-api` no Render e rode:

```bash
npm run seed
```

Isso cria:

| Perfil | E-mail | Senha |
|---|---|---|
| Gestor | gestor@resolveai.com | 123456 |
| Solicitante | solicitante@resolveai.com | 123456 |

Alternativa: cadastrar uma conta direto pela tela de registro do frontend.

## Limitações do plano free

- Os Web Services dormem após ~15 min sem tráfego e levam 30–60s para acordar na próxima requisição — acesse a URL da API um pouco antes de apresentar.
- O Postgres free do Render expira após um tempo. Para um banco permanente, considere migrar `DATABASE_URL` para um Postgres no [Neon](https://neon.tech) ou [Supabase](https://supabase.com).

## Verificando

- API: `https://<url-da-api>/api/health` deve responder `{"status":"ok"}`.
- Frontend: acessar a URL do Static Site e logar com as credenciais demo.
