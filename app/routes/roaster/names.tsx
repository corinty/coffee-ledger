import { json } from "@remix-run/server-runtime";
import { getAllRoasterNames } from "~/models/roaster.server";

export const loader = async () => {
  const roasterNames = await getAllRoasterNames().then((roasters) =>
    roasters.map((roaster) => roaster.name)
  );
  return json(roasterNames);
};
