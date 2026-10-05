import { SECTION_ORDER } from "./docs";
import { components, sectionLabel, summary } from "./manifest";

const SITE = "https://www.motion-components.dev";

const recipes = Object.keys(import.meta.glob("../pages/docs/recipes/*.astro"))
  .map((path) => path.match(/([a-z-]+)\.astro$/)![1])
  .sort();
const title = (name: string) => name.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()).replace(/\bcta\b/i, "CTA");

export const intro = `# motion-components

> Framework-agnostic web components for spring-based motion: reveals, hover and press responses, text effects, animated icons, scroll scenes, charts and ready-made widgets. One HTML tag per effect, built on Lit and Motion.

- Install: \`npm install motion-components\`, then \`import 'motion-components'\` for every tag, or \`import 'motion-components/motion-reveal'\` for one.
- No build step: \`<script type="module" src="https://cdn.jsdelivr.net/npm/motion-components@1/+esm"></script>\`.
- Works in plain HTML, React 19, Vue, Svelte, Angular, Astro and Alpine. Wrap your own markup: \`<motion-reveal><h2>Hello</h2></motion-reveal>\`.
- Every animation is interruptible and respects \`prefers-reduced-motion\`.
- Every animated component has \`play()\`, \`pause()\`, \`finish()\`, \`cancel()\`, \`playState\` and \`finished\`, and fires \`motion-start\`, \`motion-finish\` and \`motion-cancel\` (bubbling, composed).
- Time is in seconds. Spring settings are \`duration\` and \`bounce\`.`;

export function llmsIndex() {
  const groups = SECTION_ORDER.map((section) => {
    const items = components.filter((c) => c.section === section);
    if (!items.length) return "";
    return `## ${sectionLabel(section)}\n\n${items.map((c) => `- [${c.tagName}](${SITE}/docs/${c.section}/${c.tagName}.md): ${summary(c)}`).join("\n")}`;
  }).filter(Boolean);

  return `${intro}

## Docs

- [Usage](${SITE}/docs.md): install, framework setup, preload CSS and per-component imports
- [JavaScript API](${SITE}/docs/js-api.md): playback methods, events and pauseAll/resumeAll/cancelAll
- [Migrating to 1.0](${SITE}/docs/migration.md): renamed attributes and units
- [Using with AI](${SITE}/docs/ai.md): llms.txt, Markdown pages, a rules file for coding agents and editor completions

${groups.join("\n\n")}

## Recipes

${recipes.map((name) => `- [${title(name)}](${SITE}/docs/recipes/${name}.md)`).join("\n")}

## Optional

- [All components in one file](${SITE}/llms-full.txt): every component's attributes, events, slots and CSS properties
- [Blog](${SITE}/blog/): releases and guides, also as [RSS](${SITE}/rss.xml)
`;
}
