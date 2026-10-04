import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { SECTION_LABELS, SECTION_ORDER, type DocsSection } from "./docs";

interface Doc {
  name: string;
  description?: string;
  default?: string;
  type?: { text: string };
}

interface Member extends Doc {
  kind: string;
  privacy?: string;
  static?: boolean;
  attribute?: string;
  readonly?: boolean;
}

export interface Component {
  tagName: string;
  description: string;
  attributes: Doc[];
  members: Member[];
  events: Doc[];
  slots: Doc[];
  cssProperties: Doc[];
  cssParts: Doc[];
  examples: string[];
  section: DocsSection;
  url: string;
}

const SITE = "https://www.motion-components.dev";
const pages = import.meta.glob("../pages/docs/*/motion-*.astro");

const sectionOf = (tag: string) =>
  Object.keys(pages)
    .map((path) => path.match(/\/docs\/([a-z]+)\/(motion-[a-z-]+)\.astro$/))
    .find((m) => m?.[2] === tag)?.[1] as DocsSection | undefined;

function readManifest() {
  const local = join(process.cwd(), "../dist/custom-elements.json");
  const installed = join(process.cwd(), "node_modules/motion-components/dist/custom-elements.json");
  return JSON.parse(readFileSync(existsSync(join(process.cwd(), "../src")) && existsSync(local) ? local : installed, "utf8"));
}

export const components: Component[] = readManifest()
  .modules.flatMap((m: { declarations?: Record<string, unknown>[] }) => m.declarations ?? [])
  .filter((d: { tagName?: string; customElement?: boolean }) => d.tagName && d.customElement)
  .map((d: Record<string, any>) => ({
    tagName: d.tagName,
    description: d.description ?? "",
    attributes: d.attributes ?? [],
    members: d.members ?? [],
    events: d.events ?? [],
    slots: d.slots ?? [],
    cssProperties: d.cssProperties ?? [],
    cssParts: d.cssParts ?? [],
    examples: (d.examples ?? []).map((e: unknown) => (typeof e === "string" ? e : String((e as { description?: string }).description ?? ""))),
    section: sectionOf(d.tagName),
  }))
  .filter((c: Component) => c.section)
  .map((c: Component) => ({ ...c, url: `${SITE}/docs/${c.section}/${c.tagName}/` }))
  .sort((a: Component, b: Component) => SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section) || a.tagName.localeCompare(b.tagName));

export const sectionLabel = (section: DocsSection) => SECTION_LABELS[section];

const cell = (text = "") => text.replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ").trim();
const firstSentence = (text: string) => cell(text).match(/^.*?[.!?](?=\s|$)/)?.[0] ?? cell(text);

export const summary = (c: Component) => firstSentence(c.description.split(/\n\s*\n/)[0]);

/** The description cut at a sentence end, about two lines long, for share images. */
export function blurb(c: Component, limit = 170) {
  const intro = cell(c.description.split(/\n\s*\n/)[0]);
  const sentences = intro.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [intro];
  let text = sentences[0].trim();
  for (const s of sentences.slice(1)) {
    if ((text + s).length > limit) break;
    text += s;
  }
  return text.replace(/`/g, "");
}

function table(head: string[], rows: string[][]) {
  if (!rows.length) return "";
  return [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`)].join("\n");
}

const code = (text?: string) => (text ? `\`${text.replace(/`/g, "")}\`` : "");
const fence = (example: string) => (example.includes("```") ? example.trim() : "```html\n" + example.trim() + "\n```");

const PLAYBACK_EVENTS: [string, string][] = [
  ["motion-start", "When a run starts."],
  ["motion-finish", "When a run finishes."],
  ["motion-cancel", "When `cancel()` stops a run and resets it."],
];

function events(c: Component, methods: Member[]) {
  const listed = c.events.map((e) => [code(e.name), e.description ?? ""]);
  if (!methods.some((m) => m.name === "cancel")) return listed;
  for (const [name, description] of PLAYBACK_EVENTS)
    if (!c.events.some((e) => e.name === name)) listed.push([code(name), description]);
  return listed;
}

export function toMarkdown(c: Component) {
  const methods = c.members.filter((m) => m.kind === "method" && !m.privacy && !m.static && !m.name.startsWith("_"));
  const properties = c.members.filter((m) => m.kind === "field" && !m.privacy && !m.static && !m.attribute && m.description);
  const sections = [
    `# <${c.tagName}>`,
    c.description,
    `Docs: ${c.url}`,
    "## Install",
    "```js\nimport 'motion-components/" + c.tagName + "'\n```",
    "Or without a build step:\n\n```html\n<script type=\"module\" src=\"https://cdn.jsdelivr.net/npm/motion-components@1/dist/" + c.tagName + ".js/+esm\"></script>\n```",
    ...c.examples.filter(Boolean).map((e) => `## Example\n\n${fence(e)}`),
    c.attributes.length && `## Attributes\n\n${table(["Attribute", "Type", "Default", "Description"], c.attributes.map((a) => [code(a.name), code(a.type?.text), code(a.default), a.description ?? ""]))}`,
    properties.length && `## Properties\n\n${table(["Property", "Type", "Description"], properties.map((p) => [code(p.name), code(p.type?.text), p.description ?? ""]))}`,
    methods.length && `## Methods\n\n${table(["Method", "Description"], methods.map((m) => [code(`${m.name}()`), m.description ?? ""]))}`,
    events(c, methods).length && `## Events\n\nThe \`motion-*\` events bubble and are composed.\n\n${table(["Event", "Description"], events(c, methods))}`,
    c.slots.length && `## Slots\n\n${table(["Slot", "Description"], c.slots.map((s) => [s.name ? code(s.name) : "(default)", s.description ?? ""]))}`,
    c.cssProperties.length && `## CSS custom properties\n\n${table(["Property", "Description"], c.cssProperties.map((p) => [code(p.name), p.description ?? ""]))}`,
    c.cssParts.length && `## CSS parts\n\n${table(["Part", "Description"], c.cssParts.map((p) => [code(p.name), p.description ?? ""]))}`,
  ];
  return sections.filter(Boolean).join("\n\n") + "\n";
}
