import type { Roaster, Roast, Batch, Container } from "@prisma/client";

const randomDate = () =>
  new Date(+new Date() - Math.floor(Math.random() * 10000000000));

export const roasters: Roaster[] = [
  { id: "234", name: "Onyx Coffee Labs", address: null },
];
export const roasts: Roast[] = [
  { id: "1", name: "Southern Weather", roasterId: "234" },
  { id: "2", name: "The Big One", roasterId: "234" },
  { id: "3", name: "Tropical Weather", roasterId: "234" },
];

export const batches: Batch[] = [
  {
    id: "b1",
    createdAt: randomDate(),
    roastDate: randomDate(),
    roastId: "1",
  },
  {
    id: "b2",
    createdAt: randomDate(),
    roastDate: randomDate(),
    roastId: "2",
  },
  {
    id: "b3",
    createdAt: randomDate(),
    roastDate: randomDate(),
    roastId: "3",
  },
];

export const containers: Container[] = [
  { id: "c1", batchId: "b1", updatedAt: randomDate() },
  { id: "c2", batchId: "b1", updatedAt: randomDate() },
  { id: "c3", batchId: "b1", updatedAt: randomDate() },
  { id: "c4", batchId: "b2", updatedAt: randomDate() },
  { id: "c5", batchId: "b3", updatedAt: randomDate() },
  { id: "c6", batchId: "b2", updatedAt: randomDate() },
];
