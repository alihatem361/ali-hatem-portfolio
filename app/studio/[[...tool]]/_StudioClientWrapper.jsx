"use client";
/**
 * The config import lives HERE (inside the ssr:false boundary) so
 * @sanity/ui's createContext() calls never run on the server.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

// Inject a small CSS fix so the document-actions bar sticks above
// the bottom navigation bar (108 px offset).
const studioStyles = `
  .eEiNGL {
    position: sticky !important;
    bottom: 108px !important;
  }
`;

export default function StudioClientWrapper() {
  return (
    <>
      <style>{studioStyles}</style>
      <NextStudio config={config} />
    </>
  );
}
