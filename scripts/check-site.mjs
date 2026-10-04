#!/usr/bin/env node
// Checks the built site in dist/. Run after `npm run build`: npm run check:site
// Fails on: components a page uses but never loads, broken internal links, future-dated posts,
// missing SEO basics, and properties tables that list attributes the component does not have.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = process.argv[2] ? join(process.cwd(), process.argv[2], "/") : new URL("../dist/", import.meta.url).pathname;
const ROOT = new URL("../", import.meta.url).pathname;
const SITE = "https://www.motion-components.dev";

const errors = [];
const warnings = [];
const fail = (check, message) => errors.push(`[${check}] ${message}`);
const warn = (check, message) => warnings.push(`[${check}] ${message}`);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const pages = walk(DIST)
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    const rel = "/" + relative(DIST, file);
    return { file, url: rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel, html: readFileSync(file, "utf8") };
  })
  .filter((page) => !page.html.includes('http-equiv="refresh"'));
if (!pages.length) fail("build", `No pages in ${DIST}. Run npm run build first.`);

const decode = (text) => text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const meta = (html, attr, name) => html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`))?.[1];

// 1. Every motion-* tag on a page is defined by the scripts that page loads.
const scriptCache = new Map();
function scriptGraph(entry, seen = new Set()) {
  if (seen.has(entry)) return seen;
  seen.add(entry);
  const file = join(DIST, entry);
  if (!existsSync(file)) return seen;
  const code = scriptCache.get(file) ?? readFileSync(file, "utf8");
  scriptCache.set(file, code);
  for (const [, spec] of code.matchAll(/(?:import|from)\s*["'](\.{1,2}\/[^"']+\.js)["']/g)) {
    scriptGraph(join(entry, "..", spec), seen);
  }
  return seen;
}

for (const page of pages) {
  const body = page.html.replace(/<pre[\s\S]*?<\/pre>/g, "");
  const tags = new Set([...body.matchAll(/<(motion-[a-z-]+)[\s>]/g)].map((m) => m[1]));
  if (!tags.size) continue;
  let code = [...page.html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
  const entries = [...page.html.matchAll(/<script type="module" src="([^"]+)"/g)].map((m) => m[1]);
  for (const [, spec] of code.matchAll(/(?:import|from)\s*["'](\/_astro\/[^"']+\.js)["']/g)) entries.push(spec);
  for (const entry of entries) for (const file of scriptGraph(entry)) code += scriptCache.get(join(DIST, file)) ?? "";
  for (const tag of tags) {
    if (!new RegExp(`["'\`]${tag}["'\`]`).test(code)) fail("register", `${page.url} uses <${tag}> but none of its scripts define it`);
  }
}

// 2. Internal links resolve to a built file.
for (const page of pages) {
  for (const [, raw] of page.html.matchAll(/<a\b[^>]*href="([^"#?]+)/g)) {
    const href = decode(raw).replace(SITE, "");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const target = join(DIST, decodeURIComponent(href));
    const found = existsSync(target) && statSync(target).isFile() || existsSync(join(target, "index.html")) || existsSync(target.replace(/\/$/, "") + ".html");
    if (!found) fail("links", `${page.url} links to ${href}, which does not exist`);
    else if (!href.endsWith("/") && !/\.[a-z0-9]+$/i.test(href)) warn("links", `${page.url} links to ${href} without a trailing slash`);
  }
}

// 3. No blog post is dated in the future.
const blogDir = join(ROOT, "src/content/blog");
for (const file of readdirSync(blogDir).filter((f) => f.endsWith(".md"))) {
  const date = readFileSync(join(blogDir, file), "utf8").match(/^pubDate:\s*(\S+)/m)?.[1];
  if (date && new Date(date) > new Date()) fail("dates", `${file} is dated ${date}, which is in the future`);
}

// 4. SEO basics on every indexable page.
const titles = new Map();
for (const page of pages) {
  const robots = meta(page.html, "name", "robots") ?? "";
  if (robots.includes("noindex")) continue;
  const title = decode(page.html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = meta(page.html, "name", "description");
  const canonical = page.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const image = meta(page.html, "property", "og:image");
  const h1 = (page.html.match(/<h1[\s>]/g) ?? []).length;
  if (!title) fail("seo", `${page.url} has no <title>`);
  else if (title.length > 65) warn("seo", `${page.url} title is ${title.length} characters`);
  if (!description) fail("seo", `${page.url} has no meta description`);
  if (canonical !== SITE + page.url) fail("seo", `${page.url} canonical is ${canonical}`);
  if (!image || !existsSync(join(DIST, image.replace(SITE, "")))) fail("seo", `${page.url} og:image ${image} does not exist`);
  if (h1 !== 1) fail("seo", `${page.url} has ${h1} <h1> headings`);
  const markdown = page.html.match(/<link rel="alternate" type="text\/markdown" href="([^"]+)"/)?.[1];
  if (markdown && !existsSync(join(DIST, markdown))) fail("seo", `${page.url} links to Markdown ${markdown}, which does not exist`);
  titles.set(title, [...(titles.get(title) ?? []), page.url]);
}
for (const [title, urls] of titles) if (urls.length > 1) fail("seo", `duplicate title "${title}" on ${urls.join(", ")}`);

// 5. Properties tables only list attributes, properties and CSS custom properties the component has.
const localManifest = join(ROOT, "../dist/custom-elements.json");
const manifestFile = existsSync(join(ROOT, "../src")) && existsSync(localManifest) ? localManifest : join(ROOT, "node_modules/motion-components/dist/custom-elements.json");
const components = new Map(
  JSON.parse(readFileSync(manifestFile, "utf8"))
    .modules.flatMap((m) => m.declarations ?? [])
    .filter((d) => d.tagName)
    .map((d) => [d.tagName, d]),
);
const norm = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
for (const page of pages) {
  const tag = page.url.match(/^\/docs\/[a-z]+\/(motion-[a-z-]+)\/$/)?.[1];
  const component = tag && components.get(tag);
  if (!component) continue;
  const known = new Set([
    ...(component.attributes ?? []).flatMap((a) => [norm(a.name), norm(a.fieldName ?? a.name)]),
    ...(component.members ?? []).filter((m) => m.kind === "field" && !m.static && !m.privacy).map((m) => norm(m.name)),
  ]);
  const cssProperties = new Set((component.cssProperties ?? []).map((p) => p.name));
  const documented = new Set();
  for (const [, table] of page.html.matchAll(/<div class="props-table[^"]*"[^>]*>\s*<table[^>]*>([\s\S]*?)<\/table>/g)) {
    const heading = table.match(/<th[^>]*>([^<]*)<\/th>/)?.[1];
    if (heading !== "Property" && heading !== "Attribute") continue;
    for (const [, row] of table.matchAll(/<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>/g)) {
      const name = decode(row.replace(/<[^>]+>/g, "")).trim().split(/\s+…\s+/)[0];
      if (!name || name.startsWith("data-")) continue;
      const exists = name.startsWith("--") ? cssProperties.has(name) : known.has(norm(name));
      if (!exists) fail("props", `${page.url} documents "${name}", which <${tag}> does not have`);
      documented.add(name.startsWith("--") ? name : norm(name));
    }
  }
  if (!documented.size) continue;
  for (const attr of component.attributes ?? []) {
    if (!documented.has(norm(attr.name)) && !documented.has(norm(attr.fieldName ?? ""))) warn("props", `${page.url} does not document the "${attr.name}" attribute`);
  }
}

for (const line of warnings) console.warn(`warning ${line}`);
for (const line of errors) console.error(`error   ${line}`);
console.log(`Checked ${pages.length} pages: ${errors.length} errors, ${warnings.length} warnings.`);
if (errors.length) process.exit(1);
