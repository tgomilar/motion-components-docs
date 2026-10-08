export interface ShowcaseCategory {
  slug: string;
  name: string;
  tags: string[];
  blurb: string;
  built: boolean;
}

export const categories: ShowcaseCategory[] = [
  {
    slug: "text",
    name: "Text",
    tags: ["arc", "circle", "counter", "curve", "font", "glitch", "gravity", "headline", "liquid", "marker", "perspective", "ring", "scramble", "split", "stretch", "strike", "swap", "text-mask", "ticker", "typewriter", "underline", "words"],
    blurb: "Type that drops, stretches, flows, decodes, and marks itself up.",
    built: true,
  },
  {
    slug: "reveal",
    name: "Reveal",
    tags: ["blur", "blur-in", "reveal", "stagger"],
    blurb: "Content that arrives instead of just appearing.",
    built: true,
  },
  {
    slug: "respond",
    name: "Respond",
    tags: ["hover", "magnetic", "press", "tilt"],
    blurb: "Surfaces that answer your pointer like physical objects.",
    built: true,
  },
  {
    slug: "icons",
    name: "Icons",
    tags: ["icon", "state-icon"],
    blurb: "Any SVG icon, drawn in and moved on a spring.",
    built: true,
  },
  {
    slug: "scroll",
    name: "Scroll",
    tags: ["parallax", "scene"],
    blurb: "Depth and choreography driven by the scrollbar.",
    built: true,
  },
  {
    slug: "components",
    name: "Components",
    tags: ["countdown", "dialog", "flip-card", "gallery", "image-compare", "progress", "slider", "spotlight", "theme-icon", "theme-toggle"],
    blurb: "Ready-made widgets with the springs already inside.",
    built: true,
  },
  {
    slug: "charts",
    name: "Charts",
    tags: ["chart", "pie", "sparkline"],
    blurb: "Numbers that draw themselves when they come into view.",
    built: true,
  },
  {
    slug: "code",
    name: "Code",
    tags: ["code", "code-inline"],
    blurb: "Highlighted code that can type itself out.",
    built: true,
  },
];

export const categoryHref = (c: ShowcaseCategory) => (c.built ? `/showcase/${c.slug}/` : `/docs/${c.slug}/motion-${c.tags[0]}/`);
