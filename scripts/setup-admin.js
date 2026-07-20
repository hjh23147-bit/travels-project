/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@alnoor.com";
  const password = "225211.10";
  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash, role: "SUPER_ADMIN" }
    });
    console.log(`تم تحديث حساب المدير بنجاح. البريد: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        name: "المدير العام",
        email,
        passwordHash,
        role: "SUPER_ADMIN"
      }
    });
    console.log(`تم إنشاء حساب المدير بنجاح. البريد: ${email}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
