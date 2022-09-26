import type { Batch, Container, ContainerLedger } from "@prisma/client";
import { prisma } from "~/db.server";
export type { ContainerLedger };

export enum LedgerType {
  In = "in",
  Out = "out",
}


export const getOpenLedgerEntries = async () => {
  return prisma.containerLedger.findMany({
    orderBy: [
      { containerId: "asc" },
      { batch: { roastDate: "asc" } }
    ],
    include: {
      batch: { include: { roast: true } }
    },
    where: {
      dateOut: null
    }
  })
}

export const createLedgerEntry = async ({
  containerId,
  batchId,
  date: passedDate,
}: {
  containerId: Container["id"];
  batchId: Batch["id"];
  date?: string;
}) => {
  const date = passedDate ? new Date(passedDate) : new Date();

  try {
    const ledgerEntry = await prisma.$transaction(async prisma => {
      const entries = await prisma.containerLedger.findMany({
        select: {
          id: true
        },
        where: {
          containerId: containerId,
          dateOut: null
        },
        orderBy: {
          dateIn: "asc"
        }
      })

      if (entries.length > 1) {
        // Keep the latest entry and delete the rest
        entries.pop()
        await prisma.containerLedger.deleteMany({
          where: { OR: entries.map(entry => ({ id: entry.id })) }
        })
      }
      await prisma.container.upsert({
        where: { id: containerId },
        create: {
          id: containerId,
          batchId,
        },
        update: { batchId },
      })
      return prisma.containerLedger.upsert({
        where: { containerId_batchId: { containerId, batchId } },
        update: { dateIn: date, batchId, containerId, dateOut: null },
        create: { dateIn: date, batchId, containerId },
      })
    })
    return { ledgerEntry }


  } catch (error) {
    console.error(error)
  }



};

export const closeLedgerEntry = async ({
  containerId,
  batchId,
  date: passedDate,
}: {
  containerId: Container["id"];
  batchId: Batch["id"];
  date?: string | number;
}) => {
  const date = passedDate ? new Date(passedDate) : new Date();

  const [container, ledgerEntry] = await prisma.$transaction([
    prisma.container.update({
      where: { id: containerId },
      data: { batchId: null },
    }),
    prisma.containerLedger.update({
      where: { containerId_batchId: { containerId, batchId } },
      data: { dateOut: date, batchId, containerId },
    }),
  ]);

  return { container, ledgerEntry };
};
