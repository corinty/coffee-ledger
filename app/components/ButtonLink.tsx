import { Link } from "@remix-run/react";

export function ButtonLink({
  children,
  to,
}: {
  className?: any;
  children: React.ReactNode;
  to: string;
}) {
  return (
    <div className="not-prose">
      <Link to={to} className="btn btn-primary no-animation">
        {children}
      </Link>
    </div>
  );
}
