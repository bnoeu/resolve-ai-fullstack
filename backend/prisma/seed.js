const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('123456', 10);

  await prisma.usuario.upsert({
    where: { email: 'gestor@resolveai.com' },
    update: {},
    create: { nome: 'Gestor Demo', email: 'gestor@resolveai.com', senhaHash, perfil: 'GESTOR' },
  });

  await prisma.usuario.upsert({
    where: { email: 'solicitante@resolveai.com' },
    update: {},
    create: { nome: 'Solicitante Demo', email: 'solicitante@resolveai.com', senhaHash, perfil: 'SOLICITANTE' },
  });

  console.log('Seed concluído. Usuários demo criados (senha: 123456).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
