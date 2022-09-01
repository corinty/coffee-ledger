import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { zfd } from "zod-form-data";
import { closeLedgerEntry } from "~/models/containerLedger.server";

const schema = zfd.formData({
  batchId: zfd.text(),
  containerId: zfd.text(),
});

export const action: ActionFunction = async ({ request }) => {
  const { batchId, containerId } = schema.parse(await request.formData());

  await closeLedgerEntry({
    batchId,
    containerId,
  });

  return json({ ok: true });
};
