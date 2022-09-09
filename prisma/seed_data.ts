import type { Roaster, Roast, Batch, Container, ContainerLedger } from "@prisma/client";

const randomDate = () =>
  new Date(+new Date() - Math.floor(Math.random() * 10000000000));

export const roasters: Roaster[] = [
  { id: "234", name: "Onyx Coffee Labs", address: null },
];
export const roasts: Roast[] = [
  { id: "1", name: "Southern Weather", roasterId: "234", description: null },
  { id: "2", name: "The Big One", roasterId: "234", description: null },
  { id: "3", name: "Tropical Weather", roasterId: "234", description: null },
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
  { id: "1", batchId: null, updatedAt: randomDate() },
  { id: "2", batchId: null, updatedAt: randomDate() },
  { id: "3", batchId: null, updatedAt: randomDate() },
  { id: "4", batchId: null, updatedAt: randomDate() },
  { id: "5", batchId: null, updatedAt: randomDate() },
  { id: "6", batchId: null, updatedAt: randomDate() },
];

export const ledgerEntires: ContainerLedger[] = [
  { id: "1", batchId: "b1", containerId: "1", dateIn: randomDate(), dateOut: null },
  { id: "2", batchId: "b1", containerId: "2", dateIn: randomDate(), dateOut: null },
  { id: "3", batchId: "b1", containerId: "3", dateIn: randomDate(), dateOut: null },
  { id: "4", batchId: "b2", containerId: "4", dateIn: randomDate(), dateOut: null },
  { id: "5", batchId: "b2", containerId: "5", dateIn: randomDate(), dateOut: null },
  { id: "6", batchId: "b2", containerId: "6", dateIn: randomDate(), dateOut: null },
]
