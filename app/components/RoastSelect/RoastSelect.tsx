import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useFetcher } from "@remix-run/react";
import CreateRoastDialog from "./components/Dialog";

const filter = createFilterOptions<RoastOptionType>();

export default function RoastSelect() {
  const [value, setValue] = React.useState<RoastOptionType | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const roastsFetcher = useFetcher();

  React.useEffect(() => {
    if (roastsFetcher.type === "init") {
      roastsFetcher.load("/roasts");
    }
  }, [roastsFetcher]);

  const handleClose = () => {
    setDialogRoastName("");
    setIsOpen(false);
  };

  const [dialogRoastName, setDialogRoastName] = React.useState<string>("");
  if (!roastsFetcher.data) return null;

  return (
    <React.Fragment>
      <input type="text" value={value?.id} name="roastId" hidden readOnly />
      {roastsFetcher.state === "loading" ? null : (
        <Autocomplete
          value={value}
          fullWidth
          style={{ width: "100%" }}
          onChange={(event, newValue) => {
            console.log(newValue);

            if (typeof newValue === "string") {
              // timeout to avoid instant validation of the dialog's form.
              setTimeout(() => {
                setIsOpen(true);
                setDialogRoastName(newValue);
              });
            } else if (newValue && newValue.inputValue) {
              setIsOpen(true);
              setDialogRoastName(newValue.inputValue);
            } else {
              setValue(newValue);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          options={roastsFetcher.data || []}
          getOptionLabel={(option) => {
            // e.g value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          groupBy={(option) => option?.roaster?.name || "No Roaster"}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          renderInput={(params) => {
            return <TextField {...params} label="Select Roast" />;
          }}
        />
      )}
      <CreateRoastDialog
        handleClose={handleClose}
        handleDone={(value) => {
          setValue(value);
          setIsOpen(false);
        }}
        isOpen={isOpen}
        roastName={dialogRoastName}
      />
    </React.Fragment>
  );
}

interface RoastOptionType {
  inputValue?: string;
  name: string;
  id?: string;
  roaster?: { name?: string };
}
