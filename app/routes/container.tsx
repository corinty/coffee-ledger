import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: require("~/styles/containers.css") }];
};

export default function Containers() {
  return (
    <main>
      <h1>Containers</h1>
      <Outlet />
    </main>
  );
}
