import { Button } from "@mui/material";
import {
  useNavigate,
  useParams,
  Form,
  useTransition,
  useLoaderData,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { setActiveBatch } from "~/models/batch.server";
import { getActiveBatchId, updateDisplay } from "~/models/meta.server";

interface LoaderData {
  activeBatchId: string | undefined;
}
export const loader: LoaderFunction = async () => {
  const activeBatchId = await getActiveBatchId();

  return json<LoaderData>({
    activeBatchId,
  });
};

export const action: ActionFunction = async ({ params }) => {
  const { batchId } = params;
  const {
    roast: { name },
    roastDate,
  } = await setActiveBatch(batchId!);
  try {
    console.log("Attempting Fetch");
    await updateDisplay({ name, date: roastDate! });

    return json({ ok: true, screenUpdate: true });
  } catch (error) {
    return json({ ok: true, screenUpdate: false });
  }
};

export default function BatchRoot() {
  const { activeBatchId } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const { state } = useTransition();
  return (
    <>
      <Button variant="outlined" onClick={() => navigate("process")}>
        Process
      </Button>
      <Form method="post">
        <Button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Updating..." : "Set as Active Batch"}
        </Button>
      </Form>
    </>
  );
}
