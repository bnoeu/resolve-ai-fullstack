FROM node:20-slim

WORKDIR /app

# OpenSSL é necessário para os engines do Prisma (evita o erro de detecção do libssl).
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 3000

# Sincroniza o schema com o banco (cria as tabelas) e sobe a API.
CMD ["sh", "-c", "npx prisma db push --skip-generate && node src/server.js"]
