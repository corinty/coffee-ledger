import { Button } from "@mui/material";
import { useNavigate, Link } from "@remix-run/react";

export function ButtonLink({
  children,
  to,
  ...rest
}: {
  children: React.ReactNode;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <Link to={to} className="nav-button-link">
      <Button onClick={() => navigate(to)} {...rest} style={{ textDecoration: "none" }}>
        {children}
      </Button>
    </Link>
  );
}
