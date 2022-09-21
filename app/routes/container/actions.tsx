import {
  useSearchParams,
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { zfd } from "zod-form-data";
import { format } from "date-fns"

import { useState, useEffect, useRef } from "react";
import type { AlertColor } from "@mui/material";
import { Button, TextField, Snackbar, Alert, Stack, ListItem } from "@mui/material";
import {
  Delete as DeleteIcon,
  Clear as ClearIcon,
  MeetingRoom,
} from "@mui/icons-material";
import styles from "~/styles/container/actions.css";
import { openContainer, updateContainer } from "~/models/container.server";
import { getOpenLedgerEntries } from "~/models/containerLedger.server";
import ContainerUid from "~/components/ContainerUid";
import { z } from "zod";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

type LoaderData = {
  containers: Awaited<ReturnType<typeof getOpenLedgerEntries>>;
}

export async function loader() {
  // const containers = await getContainers({ inFreezer: true, orderBy: [{ batch: { roastDate: "desc" } }, { id: "desc" }] })
  const containers = await getOpenLedgerEntries()

  return json<LoaderData>({ containers })

}

const schema = zfd.formData({
  containerId: zfd.text(),
  uid: zfd.text(z.string().optional()),
  action: zfd.text(),
});

type ActionData = {
  status: AlertColor;
  message: string;
  data?: any;
};
export async function action({ request }: { request: Request }) {
  const { action, containerId, uid } = schema.parse(await request.formData());

  switch (action) {
    case "update-nfc-uid": {
      if (!uid) throw "Must have uid"
      await updateContainer({ id: containerId, uid })
      return json<ActionData>({ status: "info", "message": "Updated Container Uid" })
    }

    case "delete": {
      return json<ActionData>({ status: "info", message: "Tried to Delete" });
    }
    case "open": {
      await openContainer({ containerId })

      return json<ActionData>({ status: "success", message: "Success" });
    }
  }
}

export default function Actions() {
  const formRef = useRef<HTMLFormElement>(null);
  const [params, setSearchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const { containers } = useLoaderData<LoaderData>()
  const transistion = useTransition();
  const [alertOpen, setAlertOpen] = useState(false);
  const [showNFC, setShowNFC] = useState(false)



  useEffect(() => {
    if (!actionData) return;

    if (actionData.status == "success") {
      formRef.current?.reset()
    }
    setAlertOpen(true)
  }, [actionData]);

  const handleClose = () => setAlertOpen(false);

  const containerId = params.get("id");
  return (
    <>
      <h2>Actions</h2>
      <Snackbar
        open={alertOpen}
        onClose={handleClose}
        autoHideDuration={4000}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        onClick={handleClose}
      >
        <Alert variant="filled" severity={actionData?.status}>
          {actionData?.message}
        </Alert>
      </Snackbar>
      <Form ref={formRef} method="post" style={{ gap: 10, display: "grid" }} replace>
        <TextField
          name="containerId"
          defaultValue={containerId || ""}
          required
          disabled={Boolean(transistion.submission)}
          inputProps={{ pattern: "[0-9]*" }}
          fullWidth
          label="Container ID"
        />


        <div>
          <Button
            style={{ float: "right" }}
            endIcon={<ClearIcon />}
            color="secondary"
            type="reset"
            onClick={() => {
              setSearchParams({});
            }}
          >
            Clear
          </Button>
        </div>

        <Button
          disabled={showNFC}
          fullWidth
          type="submit"
          name="action"
          value="open"
          startIcon={<MeetingRoom />}
        >
          Open
        </Button>
        <Button
          disabled={showNFC}
          fullWidth
          type="submit"
          name="action"
          value="delete"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        {showNFC ? (
          <>
            <ContainerUid />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Button color="secondary" onClick={() => setShowNFC(false)}>
                Cancel
              </Button>


              <Button
                type="submit"
                name="action"
                value="update-nfc-uid"
              >Update UID</Button>
            </div>
          </>
        ) : (

          <Button onClick={() => setShowNFC(true)}>
            Update UID
          </Button>
        )}

      </Form>
      <Stack>
        {containers.map(container => {
          return (

            <ListItem key={container.id}>
              {container.id} |{container.batchId}| {container?.batch?.roast.name} | {format(new Date(container!.batch!.roastDate!), "MM/dd/yyyy")} | {container?.containerId}
            </ListItem>
          )
        })}


      </Stack>
    </>
  );
}
