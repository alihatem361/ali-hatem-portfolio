import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === "serve";

  /**
   * Loaded with an empty prefix so the existing unprefixed SANITY_* variables
   * are readable here. Only the two public identifiers are ever passed to
   * `define` — SANITY_API_WRITE_TOKEN is never named, so it cannot reach the
   * browser bundle. The defines are dev-only; a production build leaves them
   * out entirely, and the module that reads them is dropped with it.
   */
  const env = isDev ? loadEnv(mode, process.cwd(), "") : {};

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    define: isDev
      ? {
          __SANITY_PROJECT_ID__: JSON.stringify(env.SANITY_PROJECT_ID || ""),
          __SANITY_DATASET__: JSON.stringify(
            env.SANITY_DATASET || "production",
          ),
        }
      : {},
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: "build",
      target: "es2019",
    },
  };
});
