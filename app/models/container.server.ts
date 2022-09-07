// import type { Container } from "@prisma/client";

import { prisma } from "~/db.server";
import type { Prisma } from "@prisma/client";
import type { Container } from "@prisma/client";
import { closeLedgerEntry } from "./containerLedger.server";
import { meta_options } from "./meta.server";
export type { Container } from "@prisma/client";

const defaultParams: {
  orderBy: Prisma.Enumerable<Prisma.ContainerOrderByWithRelationInput>
} = {
  orderBy: { id: "desc" }
}
export function getContainers(params: {
  inFreezer?: boolean,
  orderBy?: Prisma.Enumerable<Prisma.ContainerOrderByWithRelationInput>
} = {}) {
  const { inFreezer, orderBy } = { ...defaultParams, ...params }
  return prisma.container.findMany({
    orderBy,
    include: { batch: { include: { roast: { include: { roaster: true } } } } },
    ...(inFreezer && { where: { NOT: { batch: null } } }),
  });
}

export function getContainerById({
  containerId,
}: {
  containerId: Container["id"];
}) {
  return prisma.container.findUnique({
    where: { id: containerId },
    include: { batch: { include: { roast: { include: { roaster: true } } } } },
  });
}

export async function openContainer({
  containerId,
}: {
  containerId: Container["id"];
}) {
  const { batchId } = await prisma.container.findUniqueOrThrow({
    where: { id: containerId }
  })

  if (!batchId) {
    throw new Error(`No Connected Batch Found for container id: "${containerId}"`)
  }
  const entry = await closeLedgerEntry({
    batchId: batchId,
    containerId,
    date: new Date().toString()
  })

  const meta = await prisma.meta.upsert({
    where: {
      key: meta_options.activeBatchId
    },
    create: {
      key: meta_options.activeBatchId,
      value: batchId
    },
    update: {
      value: batchId
    }
  })

  return { ...entry, meta }


}
