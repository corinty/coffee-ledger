import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getContainers } from "~/models/container.server";

type LoaderData = {
  containers: Awaited<ReturnType<typeof getContainers>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const containers = await getContainers();

  return json<LoaderData>({ containers });
};

export default function ContainerIndex() {
  const { containers } = useLoaderData<LoaderData>();

  return (
    <>
      <hr />
      {containers.map(({ id, batchId }) => (
        <div key={id}>
          <Link to={id}>ID: {id}</Link>
          <div>Filled: {batchId ? "True" : "False"} </div>
        </div>
      ))}
    </>
  );
}
