import { json } from "@remix-run/server-runtime";
import { closeLedgerEntry } from "~/models/containerLedger.server";

export const action = async ({ request }) => {
  const data = await request.formData();
  const params = {
    batchId: data.get("batchId"),
    containerId: data.get("containerId"),
  };

  await closeLedgerEntry(params);

  return json({ ok: true });
};
