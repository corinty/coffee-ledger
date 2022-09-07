import { json } from "@remix-run/node";
import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useMatches } from "@remix-run/react";

// export const links: LinksFunction = () => {
// return [{ rel: "stylesheet", href: require("~/styles/containers.css") }];
// };

export default function BatchIndex() {
  const match = useMatches()
  const pathParts = match.at(-1)?.pathname.split("/").filter(e => e)||[]

  const { breadcrumbs}=pathParts.reduce((acc, cur, index) => {
    acc.path = acc.path + ((index + 1) === pathParts.length ?cur: `${cur}/`)
    acc.breadcrumbs.push({
      link: acc.path,
      title: cur
    })
  return acc
  }, {
    path: "/",
    breadcrumbs: [{
      link: "/",
      title: "Home"
    }]})
  return (
    <main>
      <h1>Batches</h1>
      <nav style={{textTransform: "capitalize"}}>

      {breadcrumbs.map((breadcrumb,index) => {
        if (index == (breadcrumbs.length - 1)) {
          return breadcrumb.title
        } else {
          return <><Link to={breadcrumb.link} key={breadcrumb.link}>{breadcrumb.title}</Link> {"> "}</>

        }
      })}
      </nav>
      <Outlet />
    </main>
  );
}
