import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://motion-components.dev",
  outDir: "dist",
  integrations: [sitemap()],
});
