import type { Batch, Container, ContainerLedger } from "@prisma/client";
import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
export type { ContainerLedger };

export enum LedgerType {
  In = "in",
  Out = "out",
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

  const [container, ledgerEntry] = await prisma.$transaction([
    prisma.container.upsert({
      where: { id: containerId },
      create: { id: containerId, batchId },
      update: { batchId },
    }),
    prisma.containerLedger.upsert({
      where: { containerId_batchId: { containerId, batchId } },
      update: { dateIn: date, batchId, containerId, dateOut: null },
      create: { dateIn: date, batchId, containerId },
    }),
  ]);

  return { container, ledgerEntry };
};

export const closeLedgerEntry = async ({
  containerId,
  batchId,
  date: passedDate,
}: {
  containerId: Container["id"];
  batchId: Batch["id"];
  date?: string;
}) => {
  const date = passedDate ? new Date(passedDate) : new Date();
  const [container, ledgerEntry] = await prisma.$transaction([
    prisma.container.upsert({
      where: { id: containerId },
      create: { id: containerId },
      update: { batchId: null },
    }),
    prisma.containerLedger.update({
      where: { containerId_batchId: { containerId, batchId } },
      data: { dateOut: date, batchId, containerId },
    }),
  ]);

  return { container, ledgerEntry };
};
