// import type { Container } from "@prisma/client";

import { prisma } from "~/db.server";
import type { Container } from "@prisma/client";
export type { Container } from "@prisma/client";

export function getContainers() {
  return prisma.container.findMany({
    include: { batch: { include: { roast: { include: { roaster: true } } } } },
    orderBy: { id: "desc" },
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
