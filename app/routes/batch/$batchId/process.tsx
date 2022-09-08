import { useEffect, useRef } from "react";
import { Button, TextField } from "@mui/material";
import type { Batch } from "@prisma/client";
import { useOutletContext, useNavigate, Form, useTransition } from "@remix-run/react";

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
  console.log("processing", { containerId });

  await createLedgerEntry({
    batchId,
    containerId,
  });
  return json({})
};

export default function ProcessBatch() {
  const batch = useOutletContext<Batch>();

  const navigate = useNavigate();
  const transition = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!transition.submission) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [transition.submission]);

  return (
    <>
      <h4>Process</h4>
      <Form method="post" replace ref={formRef}>
        <input type="text" name="batchId" hidden value={batch.id} readOnly />
        <TextField
          disabled={Boolean(transition.submission)}
          inputRef={inputRef}
          fullWidth
          inputProps={{ pattern: "[0-9]*" }}
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
          <Button style={{ margin: "20px 0" }} variant="outlined" onClick={() => navigate("..")}>
            Done
          </Button>
          <Button variant="contained" type="submit" disabled={transition.submission ? true : false}>
            {transition.submission ? "..." : "Add"}
          </Button>
        </div>
      </Form>
    </>
  );
}
