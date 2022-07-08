import React, { useEffect } from "react";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { getActiveBatch } from "~/models/batch.server";
import { Tabs, Tab, Button } from "@mui/material";
import { formatShortDate } from "~/utils";

type LoaderData = {
  activeBatch: Awaited<ReturnType<typeof getActiveBatch>>;
};

export const loader = async () => {
  const activeBatch = await getActiveBatch();

  return json({ activeBatch });
};

export default function Index() {
  const { activeBatch } = useLoaderData<LoaderData>();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const {
    roast: { name: roastName, roaster },
    roastDate,
  } = activeBatch!;

  return (
    <main>
      <section>
        <h1>{roastName}</h1>
        <div>
          <strong>Roaster: </strong>
          <span>{roaster.name}</span>
        </div>
        <div>
          <strong>Roast Date: </strong>
          <span>{roastDate && formatShortDate(roastDate)}</span>
        </div>
      </section>

      <section style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <ButtonLink to="/batch">Batches</ButtonLink>
        <ButtonLink to="/batch/new">New Batch</ButtonLink>
      </section>
    </main>
  );
}

function ButtonLink({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <Button variant="contained" onClick={() => navigate(to)}>
      {children}
    </Button>
  );
}
