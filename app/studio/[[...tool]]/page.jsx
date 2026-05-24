"use client";
/**
 * app/studio/[[...tool]]/page.jsx
 *
 * "use client" is required so ssr:false on the dynamic import is permitted.
 * The server only renders the loading fallback — @sanity/ui (and its
 * createContext calls) are never evaluated server-side.
 */

import dynamic from "next/dynamic";

const StudioClientWrapper = dynamic(() => import("./_StudioClientWrapper"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      Loading Studio…
    </div>
  ),
});

export default function StudioPage() {
  return <StudioClientWrapper />;
}
