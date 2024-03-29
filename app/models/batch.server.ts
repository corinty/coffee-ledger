import type { Batch } from "@prisma/client";
import { prisma } from "~/db.server";
import { generateSlug } from "random-word-slugs";
import { meta_options } from "./meta.server";

const include = { roast: { include: { roaster: true } } };

export const getAllBatches = () =>
  prisma.batch.findMany({
    include: {
      roast: { include: { roaster: true } },
      ledgerEntires: { select: { dateIn: true, dateOut: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

export const getActiveBatch = async () => {
  const activeBatchId = await prisma.meta.findUnique({
    where: { key: "active_batch_id" },
  });

  if (!activeBatchId) return null

  return prisma.batch.findFirst({
    where: {
      id: activeBatchId.value
    },
    include,
  });
};

export const setActiveBatch = (id: Batch["id"]) => {
  prisma.meta.upsert({
    where: { key: meta_options.activeBatchId },
    create: { key: meta_options.activeBatchId, value: id },
    update: { value: id }
  })

  return prisma.batch.findUniqueOrThrow({ where: { id }, include })
}


export const createBatch = (data: Pick<Batch, "roastDate" | "roastId">) =>
  prisma.batch.create({
    data: { id: generateSlug(), ...data },
  });

export function getBatchById({ batchId }: { batchId: Batch["id"] }) {
  return prisma.batch.findUniqueOrThrow({
    where: { id: batchId },
    include: {
      roast: { include: { roaster: true } },
      ledgerEntires: { orderBy: { dateOut: "desc" } },
    },
  });
}
