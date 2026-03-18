import { PrismaClient } from "@prisma/client";

const client = new PrismaClient({
  log: ['error'],
});

// Pre-connect to handle Neon cold starts — silently retries on initial failure
client.$connect().catch(() => {
  // Silence initial connect error, Prisma will retry automatically
});

export default client;