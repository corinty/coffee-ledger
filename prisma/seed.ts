import { PrismaClient } from "@prisma/client";
import { roasts, roasters, batches, containers } from "./seed_data";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  // Seed Roasters
  await roasters.forEach(async (data) => {
    await prisma.roaster.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  });

  // Seed Roasts
  await roasts.forEach(async (data) => {
    await prisma.roast.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  });

  // Seed Batches
  await batches.forEach(async (data) => {
    await prisma.batch.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  });

  // Containers
  await containers.forEach(async (data) => {
    await prisma.container.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
