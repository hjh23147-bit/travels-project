import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = "225211.10";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Update existing admin or create if not found
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        name: "وسام (مدير النظام)",
        email: "wesam.os",
        passwordHash: passwordHash
      }
    });
    console.log("Admin updated successfully!");
  } else {
    console.log("Admin not found.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
