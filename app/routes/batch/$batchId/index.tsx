import { Button } from "@mui/material";
import { useNavigate, useParams, Form, useTransition } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/server-runtime";
import { setActiveBatch } from "~/models/batch.server";
import { updateDisplay } from "~/models/meta.server";



export const action: ActionFunction = async ({ params }) => {
  const { batchId } = params
  const { roast: { name }, roastDate } = await setActiveBatch(batchId!)
  try {
    console.log("Attempting Fetch")
    await updateDisplay({ name, date: roastDate! })

    return json({ ok: true, screenUpdate: true })
  } catch (error) {
    return json({ ok: true, screenUpdate: false })
  }




}

export default function BatchRoot() {
  const navigate = useNavigate();
  const { state } = useTransition()
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
