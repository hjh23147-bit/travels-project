/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting agency migration...");

  // 1. Create Default Agency
  const defaultAgency = await prisma.agency.create({
    data: {
      name: "رحلات النور",
      description: "المكتب الرئيسي لرحلات النور لخدمات الحج والعمرة والسياحة",
      contactPhone: "967781668332",
    }
  });
  console.log(`Created default agency: ${defaultAgency.name} with ID: ${defaultAgency.id}`);

  // 2. Migrate Packages
  const packagesResult = await prisma.package.updateMany({
    where: { agencyId: null },
    data: { agencyId: defaultAgency.id }
  });
  console.log(`Migrated ${packagesResult.count} packages to default agency.`);

  // 3. Migrate Services
  const servicesResult = await prisma.service.updateMany({
    where: { agencyId: null },
    data: { agencyId: defaultAgency.id }
  });
  console.log(`Migrated ${servicesResult.count} services to default agency.`);

  // 4. Migrate Leads
  const leadsResult = await prisma.lead.updateMany({
    where: { agencyId: null },
    data: { agencyId: defaultAgency.id }
  });
  console.log(`Migrated ${leadsResult.count} leads to default agency.`);

  // 5. Migrate Admins (assign SUPER_ADMIN to existing admins)
  const usersResult = await prisma.user.updateMany({
    where: { role: "ADMIN" },
    data: { role: "SUPER_ADMIN" }
  });
  console.log(`Upgraded ${usersResult.count} admins to SUPER_ADMIN.`);

  console.log("Migration complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
