import type { Roast, Roaster } from "@prisma/client";
import { prisma } from "~/db.server";

const include = { roaster: true };
export const getAllRoasts = async () =>
  prisma.roast.findMany({
    include,
    orderBy: { name: "asc" },
  });
export const createRoast = async ({
  coffeeName,
  roasterName,
}: {
  coffeeName: Roast["name"];
  roasterName: Roaster["name"];
}) =>
  prisma.roast.create({
    data: {
      name: coffeeName,
      roaster: {
        connectOrCreate: {
          where: { name: roasterName },
          create: { name: roasterName },
        },
      },
    },
    include,
  });

export const deleteRoast = async ({ id }: { id: string }) => {
  return await prisma.roast.delete({ where: { id } });
};
