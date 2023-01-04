import { prisma } from "~/db.server";
import { formatShortDate } from "~/utils"

export const meta_options = {
  activeBatchId: "active_batch_id"
}

export const getActiveBatchId = ()=>  prisma.meta.findUnique({
      where: { key: meta_options.activeBatchId},
    })
    .then((meta) => meta?.value);



export const updateDisplay = ({ name, date }: { name: string, date: Date }) => fetch("http://ledger-display.local:5000/update-screen", {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "POST",
  body: JSON.stringify({
    name,
    date: formatShortDate(date)
  })
})
