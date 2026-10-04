import type { APIRoute } from "astro";
import { intro } from "../data/llms";
import { components, toMarkdown } from "../data/manifest";

export const GET: APIRoute = () =>
  new Response([intro, ...components.map((c) => toMarkdown(c).replace(/^# /, "## ").replace(/^## (?!<)/gm, "### "))].join("\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
