/**
 * Run with: npx tsx scripts/migrate-password.ts
 * This migrates the admin password from SHA256 to bcrypt
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function migratePassword() {
  const newPassword = "admin123"; // ← Change this to your desired password!
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const updated = await prisma.user.updateMany({
    where: { role: "ADMIN" },
    data: { passwordHash: hashedPassword },
  });

  if (updated.count === 0) {
    // No users found - create one
    await prisma.user.create({
      data: {
        name: "مدير النظام",
        email: "admin@alnoortravel.com",
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ تم إنشاء حساب المدير بنجاح");
  } else {
    console.log(`✅ تم تحديث كلمة المرور لـ ${updated.count} مستخدم`);
  }

  console.log(`📧 البريد: admin@alnoortravel.com`);
  console.log(`🔑 كلمة المرور: ${newPassword}`);
  console.log("⚠️  يرجى تغيير كلمة المرور عبر لوحة التحكم بعد أول دخول!");

  await prisma.$disconnect();
}

migratePassword().catch((e) => {
  console.error(e);
  process.exit(1);
});
