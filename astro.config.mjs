import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.motion-components.dev",
  outDir: "dist",
  integrations: [sitemap()],
  redirects: {
    // /docs/interaction/* moved to /docs/components/*
    "/docs/interaction/motion-countdown": "/docs/components/motion-countdown",
    "/docs/interaction/motion-dialog": "/docs/components/motion-dialog",
    "/docs/interaction/motion-flip-card": "/docs/components/motion-flip-card",
    "/docs/interaction/motion-gallery": "/docs/components/motion-gallery",
    "/docs/interaction/motion-image-compare": "/docs/components/motion-image-compare",
    "/docs/interaction/motion-progress": "/docs/components/motion-progress",
    "/docs/interaction/motion-slider": "/docs/components/motion-slider",
    "/docs/interaction/motion-spotlight": "/docs/components/motion-spotlight",
    // /docs/primitives/* split into /docs/reveal/* and /docs/respond/*
    "/docs/primitives/motion-blur": "/docs/reveal/motion-blur",
    "/docs/primitives/motion-blur-in": "/docs/reveal/motion-blur-in",
    "/docs/primitives/motion-reveal": "/docs/reveal/motion-reveal",
    "/docs/primitives/motion-stagger": "/docs/reveal/motion-stagger",
    "/docs/primitives/motion-hover": "/docs/respond/motion-hover",
    "/docs/primitives/motion-magnetic": "/docs/respond/motion-magnetic",
    "/docs/primitives/motion-press": "/docs/respond/motion-press",
    "/docs/primitives/motion-tilt": "/docs/respond/motion-tilt",
  },
});
