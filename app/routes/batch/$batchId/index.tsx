import { Button } from "@mui/material";
import { useNavigate } from "@remix-run/react";

export default function BatchRoot() {
  const navigate = useNavigate();
  return (
    <Button variant="outlined" onClick={() => navigate("process")}>
      Process
    </Button>
  );
}
