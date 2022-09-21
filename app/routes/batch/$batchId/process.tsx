import { useEffect, useRef, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import type { Batch } from "@prisma/client";
import { useOutletContext, useNavigate, Form, useTransition, useLoaderData } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { createLedgerEntry } from "~/models/containerLedger.server";
import { zfd } from "zod-form-data";
import { getContainers } from "~/models/container.server";
import { useContainerUid } from "~/hooks/useContainerUid";
import { Delete, TapAndPlay } from "@mui/icons-material";

const schema = zfd.formData({
  batchId: zfd.text(),
  containerId: zfd.text(),
});

type LoaderData = {
  containerMapping: { [key: string]: string }
}


export const loader: LoaderFunction = async ({ request }) => {
  const containers = await getContainers()

  const containerMapping = containers.reduce((prev, cur) => {
    if (cur.uid) {
      prev[cur.uid] = cur.id
    }
    return prev
  }, {}) as { [key: string]: string }

  return json<LoaderData>({ containerMapping })
}

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
  const data = useLoaderData<LoaderData>()
  const { containerMapping } = data

  const navigate = useNavigate();
  const transition = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [isNFCProcess, setNFCProcess] = useState(true)

  useEffect(() => {
    if (!transition.submission) {
      formRef.current?.reset();
    }
  }, [transition.submission]);

  return (
    <>
      <h4>Process</h4>
      <Form method="post" replace ref={formRef} style={{ display: "grid", gap: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <Button
            style={{ float: "right" }}
            size="small"
            color="secondary"
            onClick={() => setNFCProcess(cur => !cur)}
          >
            {isNFCProcess ? "Single" : "NFC"} Process
          </Button>
        </div>
        <input type="text" name="batchId" hidden value={batch.id} readOnly />
        {isNFCProcess ? <NFCProcess containerMapping={containerMapping} /> : <SingleProcess />}

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

const NFCProcess = ({ containerMapping }: { containerMapping: { [key: string]: string } }) => {
  const [containers, setContainers] = useState<Map<string, string | null>>(new Map([["047f2762af4f80", "53"], ["333", null]]))
  const { uid, connected, socket, socketServer } = useContainerUid()

  const addContainer = (uid) => setContainers(cur => {
    const next = new Map(cur)
    next.set(uid, containerMapping[uid])
    return next
  })

  const removeContainer = (uid) => setContainers(cur => {
    const next = new Map(cur)
    next.delete(uid)
    return next
  })


  useEffect(() => {
    console.log("the uid changing", uid)
    if (uid && !containers.has(uid)) {

      addContainer(uid)
    }
  }, [uid])
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "gray",
          justifyContent: "space-between"
        }}
        onClick={() => {
          connected ? socket.close() : socket.connect()
        }}>
        {socketServer}
        <TapAndPlay
          fontSize="large"
          color={connected ? "success" : "error"}
          sx={{ my: 1, mx: 1 }} />
      </div>

      {Array.from(containers.entries()).map(([uid, id]) => (
        <div key={uid} style={{ display: "flex", gap: 6 }}>
          <TextField
            disabled={true}
            value={uid}
            inputProps={{ readonly: true }}
            label="NFC UID"
            onClick={() => removeContainer(uid)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Delete />
                </InputAdornment>
              )
            }} />
          <TextField name="" defaultValue={id} required label="Container ID" />
        </div>
      ))}
    </>
  )
}

const SingleProcess = () => {
  const transition = useTransition()
  return (
    <TextField
      disabled={Boolean(transition.submission)}
      fullWidth
      inputProps={{ pattern: "[0-9]*" }}
      label="Container ID"
      required
      autoFocus
      name="containerId"
    />
  )
}
