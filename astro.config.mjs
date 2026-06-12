// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "dev",
  process.cwd(),
  "",
);

// https://astro.build/config
export default defineConfig({
  output: "server",
  redirects: {
    // "/leftangles/[year]/[month]/[day]/[slug]": "/leftangles/[slug]",
  },
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false, // See note on using the CDN
      apiVersion: "2026-02-21", // insert the current date to access the latest version of the API
      studioBasePath: "/admin", // If you want to access the Studio on a route
      stega: {
        studioUrl: "/admin",
      },
    }),
    react(),
  ],

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
