import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { zfd } from "zod-form-data";
import { deleteRoast } from "~/models/roast.server";

export const action: ActionFunction = async ({ request, params }) => {
  switch (request.method) {
    case "DELETE": {
      try {
        const res = await deleteRoast({ id: params.roastId! });

        return json({ success: true, res });
      } catch (error) {
        throw error;
      }
    }
  }

  return json({});
};
