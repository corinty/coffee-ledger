import { Button, TextField } from "@mui/material";
import { Link, Outlet, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Fragment } from "react";
import { useMatch } from "react-router";
import { getBatchById } from "~/models/batch.server";
import { formatShortDate } from "~/utils";

type LoaderData = {
  batch: NonNullable<Awaited<ReturnType<typeof getBatchById>>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const batch = await getBatchById({ batchId: params.batchId! });

  return json<LoaderData>({ batch: batch! });
};

export default function Batch() {
  const { batch } = useLoaderData<LoaderData>();
  const ledgerFetcher = useFetcher();
  return (
    <>
      <nav>
        <Link to={"/"}>Home</Link> {">"} <Link to={".."}>Batch</Link> {">"}{" "}
        {batch.id}
      </nav>
      <h2>Batch: {batch.id} </h2>

      <div>Coffee: {batch.roast.name}</div>
      <div>Roaster: {batch.roast.roaster.name}</div>
      <div>
        Roast Date: {batch.roastDate ? formatShortDate(batch.roastDate) : "N/A"}
      </div>
      <section>
        <Outlet context={batch} />
      </section>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h3>Ledger Entiries</h3>
          {batch.ledgerEntires.map(
            ({ id, batchId, containerId, dateIn, dateOut }) => (
              <div key={id}>
                <ul>
                  <li>ID: {id}</li>
                  <li>Container Id: {containerId}</li>
                  <li>Date In: {dateIn}</li>
                  <li>Date Out: {dateOut}</li>
                </ul>
                {!dateOut && (
                  <ledgerFetcher.Form method="delete" action="/ledger/close">
                    <input
                      type="text"
                      hidden
                      name="containerId"
                      value={containerId}
                      readOnly
                    />
                    <input
                      type="text"
                      hidden
                      name="batchId"
                      value={batchId}
                      readOnly
                    />
                    <Button variant="contained" type="submit">
                      Close Entry
                    </Button>
                  </ledgerFetcher.Form>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
