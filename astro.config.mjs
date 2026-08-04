// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { defineConfig, fontProviders } from "astro/config";
import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "dev",
  process.cwd(),
  "",
);

// https://astro.build/config
export default defineConfig({
  fonts: [{
    provider: fontProviders.local(),
    name: "Folsom",
    cssVariable: "--font-folsom",
    options: {
      variants: [
        {
          weight: "100 900",
          style: "normal",
          src: ["./src/assets/fonts/folsom/folsom-black-web.woff2"],
        },
      ],
    },
  }, {
    provider: fontProviders.local(),
    name: "Katwijk-Mono",
    cssVariable: "--font-katwijk-mono",
    options: {
      variants: [{
        weight: "light",
        style: "normal",
        src: ["./src/assets/fonts/katwijk-mono/katwijk-mono-light-web.woff2"],
      }, {
        weight: "normal",
        style: "normal",
        src: ["./src/assets/fonts/katwijk-mono/katwijk-mono-regular-web.woff2"],
      }, {
        weight: "bold",
        style: "normal",
        src: ["./src/assets/fonts/katwijk-mono/katwijk-mono-bold-web.woff2"],
      }],
    },
  }, {
    provider: fontProviders.local(),
    name: "Clack",
    cssVariable: "--font-clack",
    options: {
      variants: [{
        weight: "100 900",
        style: "normal",
        src: ["./src/assets/fonts/clack/Clack-VF.ttf"],
      }, {
        weight: "100 900",
        style: "italic",
        src: ["./src/assets/fonts/clack/Clack-Italic-VF.ttf"],
      }],
    },
  }],
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

  adapter: cloudflare(),
  vite: {
    plugins: [],
  },
});
