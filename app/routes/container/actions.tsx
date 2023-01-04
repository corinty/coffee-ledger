import {
  useSearchParams,
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { zfd } from "zod-form-data";
import { format } from "date-fns";

import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import type { AlertColor } from "@mui/material";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack,
  ListItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Clear as ClearIcon,
  MeetingRoom,
  Update as UpdateIcon,
} from "@mui/icons-material";
import styles from "~/styles/container/actions.css";
import { getOpenLedgerEntries } from "~/models/containerLedger.server";
import ContainerUid from "~/components/ContainerUid";
import { z } from "zod";
import { useContainerUid } from "~/hooks/useContainerUid";
import { updateDisplay } from "~/models/meta.server";
import { openContainer, updateContainer } from "~/models/container.server";
import clsx from "clsx";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

type ContainerActions = "open" | "delete" | "update-nfc-uid";

type LoaderData = {
  containers: Awaited<ReturnType<typeof getOpenLedgerEntries>>;
};

export async function loader() {
  // const containers = await getContainers({ inFreezer: true, orderBy: [{ batch: { roastDate: "desc" } }, { id: "desc" }] })
  const containers = await getOpenLedgerEntries();

  return json<LoaderData>({ containers });
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
      if (!uid) throw "Must have uid";
      await updateContainer({ id: containerId, nfcTagUid: uid });
      return json<ActionData>({
        status: "info",
        message: "Updated Container Uid",
      });
    }
    case "delete": {
      return json<ActionData>({ status: "info", message: "Tried to Delete" });
    }
    case "open": {
      const {
        batch: {
          roastDate,
          roast: { name },
        },
      } = await openContainer({ containerId });
      await updateDisplay({ name, date: roastDate! });
      return json<ActionData>({
        status: "success",
        message: "Opened Container",
      });
    }
  }
}

export default function Actions() {
  const actionData = useActionData<ActionData>();
  const { containers } = useLoaderData<LoaderData>();

  const formRef = useRef<HTMLFormElement>(null);
  const [params, setSearchParams] = useSearchParams();

  const { state, submission } = useTransition();

  const [alertOpen, setAlertOpen] = useState(false);
  const [showNFC, setShowNFC] = useState(false);

  const { connected } = useContainerUid();

  const isActionSubmitted = (action: ContainerActions) => {
    if (!isSubmitting || !submission?.formData) return false;
    const activeAction = schema.parse(submission.formData).action;
    return action === activeAction;
  };

  console.log();
  const isSubmitting = state == "submitting";

  useEffect(() => {
    if (!actionData) return;

    if (actionData.status == "success") {
      formRef.current?.reset();
    }
    setAlertOpen(true);
  }, [actionData]);

  const handleClose = () => setAlertOpen(false);

  const ActionButton = ({
    text,
    action,
    icon,
    disabled,
  }: {
    text: string;
    disabled?: boolean;
    action: ContainerActions;
    icon?: ReactNode;
  }) => {
    const isSubmitting = isActionSubmitted(action);
    return (
      <button
        className={clsx("gap-3 btn", { loading: isSubmitting })}
        disabled={disabled || isSubmitting}
        type="submit"
        name="action"
        value={action}
      >
        {!isSubmitting && icon && icon}
        {text}
      </button>
    );
  };

  const containerId = params.get("id");
  return (
    <>
      <div>
        <h2>Actions</h2>
      </div>
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
      <Form ref={formRef} method="post" className="flex flex-col gap-4" replace>
        <div className="input-group">
          <input
            type="text"
            placeholder="Search…"
            name="containerId"
            defaultValue={containerId || ""}
            className="w-full input input-bordered"
            disabled={isSubmitting}
            pattern={"[0-9]*"}
          />
          <button
            className={clsx("gap-1 btn", { loading: isSubmitting })}
            type="reset"
            onClick={() => {
              setSearchParams({});
            }}
          >
            Clear
            <ClearIcon />
          </button>
        </div>
        {/* <TextField
          name="containerId"
          defaultValue={containerId || ""}
          required
          disabled={isSubmitting}
          inputProps={{ pattern: "[0-9]*" }}
          label="Container ID"
        /> */}
        <ActionButton
          action="open"
          text="Open"
          icon={<MeetingRoom />}
          disabled={showNFC}
        />
        <ActionButton
          action="delete"
          text="Delete"
          icon={<DeleteIcon />}
          disabled={showNFC}
        />

        {showNFC ? (
          <>
            <ContainerUid />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Button color="secondary" onClick={() => setShowNFC(false)}>
                Cancel
              </Button>

              <ActionButton
                disabled={!connected}
                action="update-nfc-uid"
                text={connected ? "Update UID" : "No NFC Server"}
              />
            </div>
          </>
        ) : (
          <button className="gap-3 btn" onClick={() => setShowNFC(true)}>
            <UpdateIcon />
            Update UID
          </button>
        )}
      </Form>
      <Stack>
        {containers.map((container) => {
          return (
            <ListItem key={container.id}>
              {container.id} |{container.batchId}|{" "}
              {container?.batch?.roast.name} |{" "}
              {format(new Date(container!.batch!.roastDate!), "MM/dd/yyyy")} |{" "}
              {container?.containerId}
            </ListItem>
          );
        })}
      </Stack>
    </>
  );
}
