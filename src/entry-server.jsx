/**
 * Build-time prerender entry. scripts/prerender.js imports the SSR bundle of
 * this file and calls render() once per route, writing the result into
 * build/<route>/index.html. It runs in plain Node — no browser — so it works
 * on Vercel, where the previous Chromium-based react-snap step was skipped.
 *
 * Only the initial render is captured: effects do not run on the server.
 * Anything that must be in the static HTML (notably the <SEO> head tags) has
 * to be produced during render, not in a useEffect.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";
import App from "./App.jsx";

export const render = (url) => {
  const helmetContext = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );

  const { helmet } = helmetContext;
  const head = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join("");

  return { html, head };
};
