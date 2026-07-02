import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

// 1. Inicializa o adaptador com a URL de conexão
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Passa o adaptador obrigatoriamente na criação do cliente
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;