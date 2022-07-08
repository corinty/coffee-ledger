import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
} from "@mui/material";
import type { Roast } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Transition } from "./Transition";

export default function CreateRoastDialog({
  isOpen,
  handleClose,
  handleDone,
  roastName,
}: {
  isOpen: boolean;
  roastName: string;
  handleDone: (e: Roast) => void;
  handleClose: () => void;
}) {
  const fetcher = useFetcher();
  const roasterNames = useFetcher();

  const ref = useRef(null);

  useEffect(() => {
    if (roasterNames.type === "init") {
      roasterNames.load("/roaster/names");
    }
    if (fetcher.type == "done" && fetcher.data.ok) {
      //@ts-ignore
      ref.current.reset();
      handleDone(fetcher.data.roast as Roast);
    }
  }, [fetcher, handleDone, roasterNames, roasterNames.data]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullScreen
      TransitionComponent={Transition}
    >
      <fetcher.Form
        ref={ref}
        method="post"
        action="/roast/new"
        onSubmit={(e) => {}}
      >
        <DialogTitle>Add new Coffee Roast</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <TextField
              margin="dense"
              id="coffeeName"
              name="coffeeName"
              defaultValue={roastName}
              label="title"
              type="text"
              variant="standard"
            />
            <Autocomplete
              freeSolo
              options={roasterNames.data || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  fullWidth
                  variant="standard"
                  name="roasterName"
                  label="Roaster"
                />
              )}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={fetcher.state === "submitting"}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={fetcher.state === "submitting" || fetcher.type === "done"}
            type="submit"
          >
            Add
          </Button>
        </DialogActions>
      </fetcher.Form>
    </Dialog>
  );
}
