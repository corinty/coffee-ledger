import { Button } from "@mui/material";
import { useNavigate, Link } from "@remix-run/react";

export function ButtonLink({
  className,
  children,
  to,
  ...rest
}: {
  className?: any;
  children: React.ReactNode;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <Link to={to} className="nav-button-link">
      <Button onClick={() => navigate(to)} {...rest} className={className} style={{ textDecoration: "none" }}>
        {children}
      </Button>
    </Link>
  );
}
