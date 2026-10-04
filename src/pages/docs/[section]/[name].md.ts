import type { APIRoute } from "astro";
import { components, toMarkdown, type Component } from "../../../data/manifest";

export const getStaticPaths = () =>
  components.map((component) => ({ params: { section: component.section, name: component.tagName }, props: { component } }));

export const GET: APIRoute<{ component: Component }> = ({ props }) =>
  new Response(toMarkdown(props.component), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
