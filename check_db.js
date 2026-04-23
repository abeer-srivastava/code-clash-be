import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.question.findMany();
  console.log('QUESTIONS IN DB:', JSON.stringify(questions, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
