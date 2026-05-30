import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.motion-components.dev",
  outDir: "dist",
  integrations: [sitemap()],
});
