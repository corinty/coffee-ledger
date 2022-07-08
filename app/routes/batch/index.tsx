import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getAllBatches } from "~/models/batch.server";
import { formatShortDate } from "~/utils";
import { Button } from "@mui/material";

type LoaderData = {
  batches: Awaited<ReturnType<typeof getAllBatches>>;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: require("~/styles/batch.css") }];
};
export const loader: LoaderFunction = async ({ request }) => {
  const batches = await getAllBatches();

  return json<LoaderData>({ batches });
};

export default function BatchIndex() {
  const { batches } = useLoaderData<LoaderData>();
  console.table(batches);
  return (
    <main>
      <h2>All Batches</h2>
      <div className="batch-list">
        {batches.map((batch) => {
          const { name, roaster } = batch.roast;
          return (
            <div className="batch" key={batch.id}>
              <div className="batch-description">
                <div>
                  <div>ID: {batch.id}</div>
                  <div>Coffee: {name}</div>
                  <div>Roaster: {roaster.name}</div>
                </div>
                <div>
                  <div>Opened Date: {formatShortDate(batch.createdAt)}</div>
                  {batch.roastDate && (
                    <div>Roast Date: {formatShortDate(batch.roastDate)}</div>
                  )}
                  <div>Total Jars: {batch.ledgerEntires.length}</div>
                  <div>
                    Remaining Jars:
                    {
                      batch.ledgerEntires.filter((entry) => !entry.dateOut)
                        .length
                    }
                  </div>
                </div>
              </div>
              <Link to={batch.id} key={batch.id}>
                Open
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
