import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import markdownPages from "./integrations/markdown-pages.mjs";
import { remarkMotionCode } from "./plugins/remark-motion-code.mjs";
import { rehypeTableWrap } from "./plugins/rehype-md-table.mjs";
import { rehypeInlineCode } from "./plugins/rehype-inline-code.mjs";

/** Blog post dates for the sitemap, read from each post's front matter. */
function readBlogDates() {
  const dir = fileURLToPath(new URL("./src/content/blog/", import.meta.url));
  return new Map(
    readdirSync(dir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => [file.replace(/\.md$/, ""), readFileSync(dir + file, "utf8").match(/^pubDate:\s*(\S+)/m)?.[1]]),
  );
}

const blogDates = readBlogDates();

const localSrc = fileURLToPath(new URL("../src/", import.meta.url));

/** In the motion-components-src checkout, resolve component subpaths to the local source, like tsconfig does for the main entry. */
function localComponents() {
  if (!existsSync(localSrc)) return null;
  const sections = readdirSync(localSrc);
  return {
    name: "local-motion-components",
    enforce: "pre",
    resolveId(id) {
      const name = id.match(/^motion-components\/(motion-[a-z-]+)$/)?.[1];
      const file = name && sections.map((section) => `${localSrc}${section}/${name}/${name}.ts`).find(existsSync);
      return file ?? null;
    },
  };
}

export default defineConfig({
  site: "https://www.motion-components.dev",
  outDir: "dist",
  integrations: [
    markdownPages(),
    sitemap({
      serialize(item) {
        const date = blogDates.get(item.url.match(/\/blog\/([^/]+)\/$/)?.[1] ?? "");
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      },
    }),
  ],
  vite: {
    plugins: [localComponents()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (/node_modules\/(motion|motion-dom|motion-utils|framer-motion)\//.test(id)) return "motion";
            if (/node_modules\/(lit|lit-html|lit-element|@lit)\//.test(id)) return "lit";
          },
        },
      },
    },
  },
  markdown: {
    remarkPlugins: [remarkMotionCode],
    rehypePlugins: [rehypeTableWrap, rehypeInlineCode],
    // Shiki still highlights fences that opt out via the `plain` meta flag.
    shikiConfig: {
      theme: "github-dark-default",
    },
  },
  redirects: {
    // /docs/interaction/* moved to /docs/components/*
    "/docs/interaction/motion-countdown": "/docs/components/motion-countdown/",
    "/docs/interaction/motion-dialog": "/docs/components/motion-dialog/",
    "/docs/interaction/motion-flip-card": "/docs/components/motion-flip-card/",
    "/docs/interaction/motion-gallery": "/docs/components/motion-gallery/",
    "/docs/interaction/motion-image-compare": "/docs/components/motion-image-compare/",
    "/docs/interaction/motion-progress": "/docs/components/motion-progress/",
    "/docs/interaction/motion-slider": "/docs/components/motion-slider/",
    "/docs/interaction/motion-spotlight": "/docs/components/motion-spotlight/",
    // /docs/primitives/* split into /docs/reveal/* and /docs/respond/*
    "/docs/primitives/motion-blur": "/docs/reveal/motion-blur/",
    "/docs/primitives/motion-blur-in": "/docs/reveal/motion-blur-in/",
    "/docs/primitives/motion-reveal": "/docs/reveal/motion-reveal/",
    "/docs/primitives/motion-stagger": "/docs/reveal/motion-stagger/",
    "/docs/primitives/motion-hover": "/docs/respond/motion-hover/",
    "/docs/primitives/motion-magnetic": "/docs/respond/motion-magnetic/",
    "/docs/primitives/motion-press": "/docs/respond/motion-press/",
    "/docs/primitives/motion-tilt": "/docs/respond/motion-tilt/",
    // motion-state-icon was renamed to motion-icon-state
    "/docs/icons/motion-state-icon": "/docs/icons/motion-icon-state/",
  },
});
