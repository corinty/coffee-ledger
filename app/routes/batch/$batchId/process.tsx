import { useEffect, useRef, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import type { Batch, NfcTag } from "@prisma/client";
import { useOutletContext, useNavigate, Form, useTransition, useLoaderData } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { createLedgerEntry } from "~/models/containerLedger.server";
import { zfd } from "zod-form-data";
import z from "zod";

import { useContainerUid } from "~/hooks/useContainerUid";
import { Delete, TapAndPlay } from "@mui/icons-material";
import { updateNfcTag, getContainerMapping } from "~/models/nfcTag.server";


const schema = zfd.formData({
  batchId: zfd.text(),
  containerId: zfd.text(z.string().optional()),
  containerIds: zfd.repeatableOfType(zfd.json(
    z.object({
      uid: z.string(),
      id: z.string()
    })
  ))
})

type LoaderData = {
  containerMapping: { [key: NfcTag["uid"]]: NfcTag["containerId"] }
}


export const loader: LoaderFunction = async ({ request }) => {



  return json<LoaderData>({ containerMapping: await getContainerMapping() })
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const { batchId, containerId, containerIds } = schema.parse(await request.formData());


    if (containerId) {

      await createLedgerEntry({
        batchId,
        containerId,
      });
    } else if (containerIds) {
      console.log("building it all up")
      const allThings = await Promise.all(containerIds.map(({ id, uid }) => (
        [
          updateNfcTag({ containerId: id, uid }),
          createLedgerEntry({ batchId, containerId: id })
        ]
      )).flat())
      console.log(allThings)
    }

  } catch (error) {
    console.log("error happened", error)
    throw error

  }

  return json({})
};

export default function ProcessBatch() {
  const batch = useOutletContext<Batch>();
  const data = useLoaderData<LoaderData>()
  const { containerMapping } = data
  console.log("the data", { containerMapping })

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

const NFCProcess = ({ containerMapping }: { containerMapping: { [key: NfcTag["uid"]]: NfcTag["containerId"] } }) => {
  const [containers, setContainers] = useState<Map<string, string | null>>(new Map())
  const { uid, connected, socket, socketServer } = useContainerUid()

  const removeContainer = (uid) => setContainers(cur => {
    const next = new Map(cur)
    next.delete(uid)
    return next
  })


  useEffect(() => {
    console.log("the uid changing", uid)
    if (uid && !containers.has(uid)) {

      setContainers(cur => {
        const next = new Map(cur)
        next.set(uid, containerMapping[uid])
        return next
      })

    }
  }, [containerMapping, containers, uid])

  const TagPair = ({ uid, id: passedId }: { uid: String, id: String | null }) => {
    const [id, setId] = useState(passedId)
    return (
      <div style={{ display: "flex", gap: 6 }}>
        <input type="text" name="containerIds" hidden readOnly value={JSON.stringify({ uid, id })} />
        <TextField
          disabled={true}
          value={uid}
          inputProps={{ readOnly: true }}
          label="NFC UID"
          onClick={() => removeContainer(uid)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Delete />
              </InputAdornment>
            )
          }} />
        <TextField
          defaultValue={id}
          inputProps={{ pattern: "[0-9]*" }}
          onChange={(e) => {
            setId(e.target.value)
          }} required label="Container ID" />
      </div>

    )
  }
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
        <TagPair uid={uid} id={id} key={uid} />
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
