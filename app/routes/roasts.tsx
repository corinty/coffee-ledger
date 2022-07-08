import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getAllRoasts } from "~/models/roast.server";

export const loader: LoaderFunction = async () => {
  return json(await getAllRoasts());
};
