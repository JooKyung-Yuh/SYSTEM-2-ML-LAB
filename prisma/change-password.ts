import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@mllab.korea.ac.kr';
  const newPassword = process.env.ADMIN_PASSWORD;

  if (!newPassword) {
    console.error('ERROR: Set ADMIN_PASSWORD in .env first');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`Password updated for: ${user.email}`);
}

main()
  .catch((e) => {
    console.error('Failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
