import { Button, TextField } from "@mui/material";
import type { Batch } from "@prisma/client";
import { useOutletContext, useNavigate } from "@remix-run/react";

import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { createLedgerEntry } from "~/models/containerLedger.server";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  batchId: zfd.text(),
  containerId: zfd.text(),
});

export const action: ActionFunction = async ({ request }) => {
  const { batchId, containerId } = schema.parse(await request.formData());

  const { container, ledgerEntry } = await createLedgerEntry({
    batchId,
    containerId,
  });

  return json({ container, ledgerEntry });
};

export default function ProcessBatch() {
  const batch = useOutletContext<Batch>();

  const navigate = useNavigate();
  return (
    <>
      <h4>Process</h4>
      <form method="post">
        <input type="text" name="batchId" hidden value={batch.id} readOnly />
        <TextField
          fullWidth
          onKeyDown={(e) => {
            if (e.code === "Escape") navigate("..");
          }}
          label="Container ID"
          required
          autoFocus
          name="containerId"
        />

        <div
          style={{
            gap: 25,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            style={{ margin: "20px 0" }}
            variant="outlined"
            onClick={() => navigate("..")}
          >
            Done
          </Button>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </div>
      </form>
    </>
  );
}
