import type { NfcTag } from "@prisma/client"
import { prisma } from "~/db.server"


export const updateNfcTag = async ({
  containerId,
  uid
}: {
  containerId: NfcTag["containerId"],
  uid: NfcTag["uid"]
}) => prisma.nfcTag.upsert({
  where: {
    uid
  },
  create: { uid, containerId },
  update: { containerId }
})
