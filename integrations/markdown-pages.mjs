import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Hand-written docs pages that also get a Markdown version, as [page, Markdown file] pairs. */
export function markdownPages(dist) {
  const recipes = existsSync(`${dist}docs/recipes`) ? readdirSync(`${dist}docs/recipes`) : [];
  return [
    ["docs/index.html", "docs.md"],
    ["docs/js-api/index.html", "docs/js-api.md"],
    ["docs/migration/index.html", "docs/migration.md"],
    ["docs/ai/index.html", "docs/ai.md"],
    ...recipes.map((name) => [`docs/recipes/${name}/index.html`, `docs/recipes/${name}.md`]),
  ].filter(([page]) => existsSync(dist + page));
}

const VOID = new Set(["br", "hr", "img", "input", "link", "meta", "source", "wbr"]);
const SKIP_TAGS = new Set(["script", "style", "button", "svg", "template", "nav", "noscript"]);
const SKIP_CLASSES = ["demo-wrap", "js-api-demo", "fw-tab-list", "docs-pagination", "sr-only", "visually-hidden"];

const decode = (text) =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

/** Parses well-formed built HTML into a small tree of { tag, attrs, children } and strings. */
function parse(html) {
  const root = { tag: "root", attrs: {}, children: [] };
  const stack = [root];
  for (const [, text, close, tag, rawAttrs] of html.matchAll(/([^<]+)|<\/([a-z0-9-]+)\s*>|<([a-z0-9-]+)([^>]*)>|<!--[\s\S]*?-->/gi)) {
    const parent = stack[stack.length - 1];
    if (text) parent.children.push(decode(text));
    else if (close) {
      const index = stack.map((n) => n.tag).lastIndexOf(close.toLowerCase());
      if (index > 0) stack.length = index;
    } else if (tag) {
      const attrs = Object.fromEntries([...(rawAttrs ?? "").matchAll(/([a-z-:]+)(?:="([^"]*)")?/gi)].map(([, k, v]) => [k, decode(v ?? "")]));
      const node = { tag: tag.toLowerCase(), attrs, children: [] };
      parent.children.push(node);
      if (!VOID.has(node.tag) && !rawAttrs?.trim().endsWith("/")) stack.push(node);
    }
  }
  return root;
}

const text = (node) => (typeof node === "string" ? node : node.children.map(text).join(""));
const skip = (node) =>
  SKIP_TAGS.has(node.tag) || SKIP_CLASSES.some((name) => (node.attrs.class ?? "").split(/\s+/).includes(name)) || node.attrs["aria-hidden"] === "true";

/** Renders inline content: text, links, inline code and emphasis. */
function inline(node) {
  if (typeof node === "string") return node.replace(/\s+/g, " ");
  if (skip(node)) return "";
  const inner = () => node.children.map(inline).join("");
  switch (node.tag) {
    case "code":
    case "kbd":
    case "motion-code-inline":
      return "`" + text(node).trim() + "`";
    case "a": {
      const label = inner().trim();
      const href = node.attrs.href ?? "";
      return href ? `[${label}](${href.startsWith("/") ? "https://www.motion-components.dev" + href : href})` : label;
    }
    case "strong":
    case "b":
      return `**${inner().trim()}**`;
    case "em":
    case "i":
      return `_${inner().trim()}_`;
    case "br":
      return "\n";
    default:
      return inner();
  }
}

function table(node) {
  const rows = [];
  const collect = (n) => {
    if (typeof n === "string") return;
    if (n.tag === "tr") rows.push(n.children.filter((c) => typeof c !== "string" && (c.tag === "td" || c.tag === "th")).map((c) => inline(c).trim().replace(/\|/g, "\\|")));
    else n.children.forEach(collect);
  };
  collect(node);
  if (!rows.length) return "";
  const [head, ...body] = rows;
  return [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...body.map((r) => `| ${r.join(" | ")} |`)].join("\n");
}

function codeBlock(node) {
  const find = (n, tag) => (typeof n === "string" ? null : n.tag === tag ? n : n.children.map((c) => find(c, tag)).find(Boolean) ?? null);
  const pre = find(node, "pre");
  const code = pre ? text(pre).replace(/^\n+|\s+$/g, "") : "";
  if (!code) return "";
  const lang = node.attrs["code-lang"] || (node.attrs.filename ?? "").split(".").pop() || "";
  return "```" + lang + "\n" + code + "\n```";
}

/** Renders block content, separated by blank lines. */
function blocks(node, out = []) {
  for (const child of node.children) {
    if (typeof child === "string") {
      if (child.trim()) out.push(child.trim().replace(/\s+/g, " "));
      continue;
    }
    if (skip(child)) continue;
    const { tag } = child;
    if (/^h[1-6]$/.test(tag)) out.push("#".repeat(Number(tag[1])) + " " + inline(child).trim());
    else if (tag === "p") out.push(inline(child).trim());
    else if (tag === "motion-code") out.push(codeBlock(child));
    else if (tag === "pre") out.push("```\n" + text(child).replace(/\s+$/, "") + "\n```");
    else if (tag === "table") out.push(table(child));
    else if (tag === "ul" || tag === "ol")
      out.push(
        child.children
          .filter((li) => typeof li !== "string" && li.tag === "li")
          .map((li, i) => `${tag === "ol" ? `${i + 1}.` : "-"} ${inline(li).trim()}`)
          .join("\n"),
      );
    else if ((child.attrs.class ?? "").includes("fw-tabs")) out.push(frameworkTabs(child));
    else blocks(child, out);
  }
  return out;
}

/** Framework tabs: each tab label becomes a heading over its panel. */
function frameworkTabs(node) {
  const labels = [];
  const panels = [];
  const walk = (n) => {
    if (typeof n === "string") return;
    const cls = n.attrs.class ?? "";
    if (cls.split(/\s+/).includes("fw-tab")) labels.push(text(n).trim());
    else if (cls.split(/\s+/).includes("fw-panel")) panels.push(n);
    else n.children.forEach(walk);
  };
  walk(node);
  return panels.map((panel, i) => [`#### ${labels[i] ?? ""}`.trim(), ...blocks(panel)].join("\n\n")).join("\n\n");
}

export function pageToMarkdown(html, url) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  const description = html.match(/<meta property="og:description" content="([^"]*)"/)?.[1];
  const parts = blocks(parse(main)).filter(Boolean);
  const level = (block) => block.match(/^(#{1,6}) [^\n]*$/)?.[1].length ?? 0;
  const body = parts.filter((block, i) => !level(block) || (i + 1 < parts.length && (!level(parts[i + 1]) || level(parts[i + 1]) > level(block)))).join("\n\n");
  const intro = description ? `\n\n> ${decode(description)}` : "";
  const [first, ...rest] = body.split("\n\n");
  return `${first}${intro}\n\nSource: ${url}\n\n${rest.join("\n\n")}\n`;
}

/** Astro integration: writes the Markdown files after the build and appends them to llms-full.txt. */
export default function markdownPagesIntegration() {
  return {
    name: "markdown-pages",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const dist = fileURLToPath(dir);
        const pages = markdownPages(dist);
        const written = [];
        for (const [page, target] of pages) {
          const url = "https://www.motion-components.dev/" + page.replace(/index\.html$/, "");
          const markdown = pageToMarkdown(readFileSync(dist + page, "utf8"), url);
          writeFileSync(dist + target, markdown);
          written.push(markdown);
        }
        if (existsSync(dist + "llms-full.txt") && written.length) {
          appendFileSync(dist + "llms-full.txt", "\n\n" + written.map((md) => md.replace(/^(#+) /gm, "#$1 ")).join("\n\n"));
        }
      },
    },
  };
}
