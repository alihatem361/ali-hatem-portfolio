/**
 * Writes a static HTML file for every route in package.json "prerenderRoutes"
 * (regenerated from live content by fetch-sanity-content.js).
 *
 * Runs after `vite build` and the SSR build of src/entry-server.jsx. It needs
 * only Node, so unlike the old react-snap step it also runs on Vercel — which
 * is where production HTML actually comes from, since Vercel builds the site
 * itself and `vite build` empties build/ first.
 *
 * Fails the build if a page comes out without content or without a <title>,
 * rather than deploying an empty shell.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const buildDir = path.join(root, "build");
const ssrDir = path.join(root, "build-ssr");

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const routes = pkg.prerenderRoutes || [];
if (!routes.length) {
  console.error("prerender: package.json has no prerenderRoutes.");
  process.exit(1);
}

const template = readFileSync(path.join(buildDir, "index.html"), "utf8");
const ROOT_TAG = '<div id="root"></div>';
if (!template.includes(ROOT_TAG)) {
  console.error(`prerender: ${ROOT_TAG} not found in build/index.html.`);
  process.exit(1);
}

const { render } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const outputFor = (route) =>
  route === "/"
    ? path.join(buildDir, "index.html")
    : path.join(buildDir, route.replace(/^\//, ""), "index.html");

const failures = [];

for (const route of routes) {
  let html;
  let head;
  try {
    ({ html, head } = render(route));
  } catch (error) {
    failures.push(`${route}: render threw: ${error.message}`);
    continue;
  }

  if (!html.trim()) failures.push(`${route}: #root is empty`);
  if (!/<title[^>]*>[^<]+<\/title>/.test(head)) {
    failures.push(`${route}: no <title> in rendered head`);
  }

  const page = template
    .replace("</head>", `${head}</head>`)
    .replace(ROOT_TAG, `<div id="root">${html}</div>`);

  const file = outputFor(route);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, page, "utf8");
}

// Any URL without a prerendered page gets this, with a 404 status (Vercel
// serves build/404.html for unmatched paths when no SPA rewrite is set).
try {
  const { html, head } = render("/__not-found__");
  if (!/<title[^>]*>[^<]+<\/title>/.test(head) || !html.trim()) {
    failures.push("404.html: empty render or no <title>");
  }
  writeFileSync(
    path.join(buildDir, "404.html"),
    template
      .replace("</head>", `${head}</head>`)
      .replace(ROOT_TAG, `<div id="root">${html}</div>`),
    "utf8",
  );
} catch (error) {
  failures.push(`404.html: render threw: ${error.message}`);
}

rmSync(ssrDir, { recursive: true, force: true });

if (failures.length) {
  console.error(`prerender failed for ${failures.length} route(s):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`prerender: wrote ${routes.length} pages + 404.html.`);
