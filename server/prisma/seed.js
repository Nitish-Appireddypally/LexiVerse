const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting the seeding process...');

  const adminEmail = 'admin@lexiverse.com';
  const adminPassword = 'admin123'; // Use a secure password in a real project

  // Hash the admin password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // Use `upsert` to create the admin user only if they don't already exist.
  // This makes the seed script safe to run multiple times.
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // We don't need to update anything if they exist
    create: {
      name: 'LexiVerse Admin',
      email: adminEmail,
      password_hash: hashedPassword,
      role: 'Admin', // Assign the Admin role
    },
  });

  console.log(`✅ Admin user created or already exists: ${admin.email}`);
  console.log('✨ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });