import type { Roast, Roaster } from "@prisma/client";
import { prisma } from "~/db.server";

export const getAllRoasterNames = async () =>
  prisma.roaster.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

export const createRoasterByName = async ({
  name,
}: {
  name: Roaster["name"];
}) =>
  prisma.roaster.upsert({
    where: { name },
    create: {
      name,
    },
    update: {
      name,
    },
  });
