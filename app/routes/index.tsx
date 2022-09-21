import React from "react";
import { json } from "@remix-run/server-runtime";
import { getActiveBatch } from "~/models/batch.server";
import { formatShortDate } from "~/utils";
import { ButtonLink } from "~/components/ButtonLink";
import { useLoaderData } from "@remix-run/react";
import { styled } from "@mui/material";
import ContainerUid from "~/components/ContainerUid"

type LoaderData = {
  activeBatch: Awaited<ReturnType<typeof getActiveBatch>>;
};

export const loader = async () => {
  const activeBatch = await getActiveBatch();

  return json({ activeBatch });
};

export default function Index() {
  const { activeBatch } = useLoaderData<LoaderData>();

  const Nav = styled("nav")`
    margin-top: 20px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  `

  return (
    <main>
      {activeBatch ? <ActiveBatch batch={activeBatch} /> : (
        <section>
          No Active Batch Selected

        </section>

      )}
      {/* <nav style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}> */}
      <ContainerUid />
      <Nav>
        <ButtonLink to="/container/actions">Container Actions</ButtonLink>
        <div style={{ gap: 12, width: "100%" }}>
          <ButtonLink to="/batch">Batches</ButtonLink>
          <ButtonLink to="/batch/new">New Batch</ButtonLink>
        </div>
      </Nav>
    </main >
  );
}

function ActiveBatch({ batch: { roast: { name, roaster }, roastDate, id } }: { batch: any }) {
  return (
    <section>
      <h1>{name}</h1>
      <div>
        <strong>Batch Id: </strong>
        <span>{id}</span>
      </div>
      <div>
        <strong>Roaster: </strong>
        <span>{roaster.name}</span>
      </div>
      <div>
        <strong>Roast Date: </strong>
        <span>{roastDate && formatShortDate(roastDate)}</span>
      </div>
    </section>
  )
}
