import React, { useEffect } from "react";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { getActiveBatch } from "~/models/batch.server";
import { Tabs, Tab, Button } from "@mui/material";
import { formatShortDate } from "~/utils";
import { Batch } from "@prisma/client";
import { ButtonLink } from "~/components/ButtonLink";

type LoaderData = {
  activeBatch: Awaited<ReturnType<typeof getActiveBatch>>;
};

export const loader = async () => {
  const activeBatch = await getActiveBatch();

  return json({ activeBatch });
};

export default function Index() {
  const { activeBatch } = useLoaderData<LoaderData>();

  return (
    <main>
      {activeBatch ? <ActiveBatch batch={activeBatch} /> : (
        <section>
        No Active Batch Selected

          </section>

      )}
      <nav style={{ marginTop: 20, display: "flex", gap: 12, flexWrap:"wrap" }}>
        <ButtonLink to="/container/actions">Container Actions</ButtonLink>
        <div style={{gap: 12, width:"100%"}}>
          <ButtonLink to="/batch" style={{marginRight:15}}>Batches</ButtonLink>
          <ButtonLink to="/batch/new">New Batch</ButtonLink>
        </div>
      </nav>
    </main>
  );
}

function ActiveBatch({ batch: {roast:{name, roaster},roastDate, id}}:{batch:any}) {
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
