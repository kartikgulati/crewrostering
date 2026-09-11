import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const superAdminUsername = 'superadmin';
  const superAdminPassword = 'SuperAdminPassword123!'; // In production, use env vars

  const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { username: superAdminUsername },
    update: {},
    create: {
      username: superAdminUsername,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      quizLimit: 100,
    },
  });

  console.log(`Super Admin created/verified: ${superAdmin.username}`);

  // Associate all existing quizzes with the super admin
  const quizzes = await prisma.quiz.findMany({
    where: { adminId: null as any },
  });

  if (quizzes.length > 0) {
    console.log(`Associating ${quizzes.length} existing quizzes with super admin...`);
    await prisma.quiz.updateMany({
      where: { adminId: null as any },
      data: { adminId: superAdmin.id },
    });
  } else {
    console.log('No quizzes needed association.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
