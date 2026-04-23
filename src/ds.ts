import { PrismaClient } from "@prisma/client";

const MAX_RETRIES = 5;

const client = new PrismaClient({
  log: ['error'],
});

// Eagerly connect with retry logic to handle Neon cold starts
async function connectWithRetry() {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      await client.$connect();
      console.log("✅ Connected to database successfully");
      return;
    } catch (error: any) {
      retries++;
      const delay = Math.min(1000 * Math.pow(2, retries), 10000);
      console.warn(
        `⚠️  Database connection attempt ${retries}/${MAX_RETRIES} failed. Retrying in ${delay}ms...`,
        error?.message || ""
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  console.error("❌ Failed to connect to database after multiple retries. Queries will retry on demand.");
}

connectWithRetry();

export default client;