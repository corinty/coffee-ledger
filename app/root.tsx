import { useContext } from "react";
import { json } from "@remix-run/node";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { withEmotionCache } from "@emotion/react";
import { IoProvider } from "socket.io-react-hook";
import styles from "./styles/app.css";

import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import theme from "./src/theme";
import ClientStyleContext from "~/src/ClientStyleContex";

import { getUser } from "./session.server";
import Menu from "~/components/Menu";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  ENV: {
    SOCKET_SERVER: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
    ENV: {
      SOCKET_SERVER: process.env.SOCKET_SERVER!,
    },
  });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Espresso",
  viewport: "width=device-width,initial-scale=1",
});

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en" data-theme="dark">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}
          <Meta />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
          <Links />
        </head>
        <body>
          <Menu>
            <main style={{ maxWidth: 750, margin: "0 auto" }} className="prose">
              <IoProvider>{children}</IoProvider>
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
              <script></script>
            </main>
          </Menu>
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
