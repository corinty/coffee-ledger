import * as React from "react";
import { Button, TextField } from "@mui/material";
import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import RoastSelect from "~/components/RoastSelect";
import { createBatch } from "~/models/batch.server";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  roastDate: zfd.text(),
  roastId: zfd.text(),
});

export const action: ActionFunction = async ({ request }) => {
  try {
    const { roastDate, roastId } = schema.parse(await request.formData());

    const { id } = await createBatch({
      roastDate: new Date(roastDate),
      roastId,
    });

    return redirect(`/batch/${id}`);
  } catch (error) {
    throw error;
  }
};

export default function NewBatch() {
  return (
    <div>
      <h2>Create New Batch</h2>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <RoastSelect />
        <BasicDatePicker />
        <Button variant="contained" type="submit">
          Create Batch
        </Button>
      </Form>
    </div>
  );
}

export function BasicDatePicker() {
  const [value, setValue] = React.useState<Date | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Roast Date"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField name="roastDate" {...params} />}
      />
    </LocalizationProvider>
  );
}
