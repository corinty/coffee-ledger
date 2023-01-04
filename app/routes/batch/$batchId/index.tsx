import { Button } from "@mui/material";
import { Form, useTransition, Link } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { setActiveBatch } from "~/models/batch.server";

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
  const { state } = useTransition();
  return (
    <div className="flex gap-3 my-4">
      <Link to={"process"} className="btn btn-outline">
        Process
      </Link>
      <Form method="post">
        <button
          className="btn btn-outline"
          type="submit"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Updating..." : "Set as Active Batch"}
        </button>
      </Form>
    </div>
  );
}
