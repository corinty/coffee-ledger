import { Button } from "@mui/material";
import type { ContainerLedger } from "@prisma/client";
import {
  Link,
  Outlet,
  useLoaderData,
  useFetcher,
  useTransition,
} from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { getBatchById } from "~/models/batch.server";
import { formatShortDate } from "~/utils";

type LoaderData = {
  batch: NonNullable<Awaited<ReturnType<typeof getBatchById>>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const batch = await getBatchById({ batchId: params.batchId! });

  return json<LoaderData>({
    batch: batch,
  });
};

export default function Batch() {
  const { batch } = useLoaderData<LoaderData>();
  return (
    <>
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
          <h3>Ledger Entiries: open</h3>
          {batch.ledgerEntires
            .filter((entry) => !entry.dateOut)
            .map((entry) => (
              <LedgerEntry entry={entry} key={entry.id} allowClose />
            ))}
        </div>
        <div>
          <h3>Ledger Entiries: All </h3>
          {batch.ledgerEntires
            .filter((entry) => entry.dateOut)
            .map((entry) => (
              <LedgerEntry entry={entry} key={entry.id} />
            ))}
        </div>
      </div>
    </>
  );
}

function LedgerEntry({
  entry: { id, containerId, dateIn, dateOut, batchId },
  allowClose,
}: {
  entry: ContainerLedger;
  allowClose?: boolean;
}) {
  const ledgerFetcher = useFetcher();
  return (
    <div key={id} hidden={Boolean(ledgerFetcher.submission)}>
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
          <input type="text" hidden name="batchId" value={batchId} readOnly />
          {allowClose && (
            <Button variant="contained" type="submit">
              Close Entry
            </Button>
          )}
        </ledgerFetcher.Form>
      )}
    </div>
  );
}
